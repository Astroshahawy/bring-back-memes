// Resolves a Facebook username to a profile picture URL and caches it.
// fbcdn image URLs carry an expiry, so cache entries are short-lived.

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const NOT_FOUND_TTL_MS = 60 * 60 * 1000; // retry unknown names after 1 hour
const inflight = new Map();

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "resolveAvatar") return;
  resolveAvatar(msg.username).then((url) => sendResponse({ url }));
  return true; // keep the channel open for the async response
});

async function resolveAvatar(username) {
  const key = "avatar:" + username.toLowerCase();

  const cached = (await chrome.storage.local.get(key))[key];
  if (cached && Date.now() - cached.at < (cached.url ? CACHE_TTL_MS : NOT_FOUND_TTL_MS)) {
    return cached.url;
  }

  if (!inflight.has(key)) {
    inflight.set(
      key,
      (async () => {
        const url = (await fromGraph(username)) || (await fromProfilePage(username));
        await chrome.storage.local.set({ [key]: { url, at: Date.now() } });
        return url;
      })().finally(() => inflight.delete(key))
    );
  }
  return inflight.get(key);
}

// Public picture endpoint. Works for most Pages without a token; personal
// profiles usually need one, in which case this returns null.
async function fromGraph(username) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/${encodeURIComponent(username)}/picture?type=large&redirect=false`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data?.url || data.is_silhouette) return null;
    return data.url;
  } catch {
    return null;
  }
}

// Fallback: load fb.com/<username> with the user's own session and pull the
// picture out of the page HTML.
async function fromProfilePage(username) {
  try {
    const res = await fetch(`https://www.facebook.com/${encodeURIComponent(username)}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const html = await res.text();

    const patterns = [
      /"profilePicLarge":\{"uri":"([^"]+)"/,
      /"profilePic160":\{"uri":"([^"]+)"/,
      /"profile_picture":\{"uri":"([^"]+)"/,
      /<meta\s+property="og:image"\s+content="([^"]+)"/,
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m) return decode(m[1]);
    }
    return null;
  } catch {
    return null;
  }
}

function decode(s) {
  return s
    .replace(/\\\//g, "/")
    .replace(/\\u0025/g, "%")
    .replace(/&amp;/g, "&");
}
