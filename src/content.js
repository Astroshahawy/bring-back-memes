// Finds [[username]] in chat text and swaps it for the profile picture.

const TOKEN_RE = /\[\[([A-Za-z0-9.]{1,50})\]\]/g;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "NOSCRIPT"]);
const avatarRequests = new Map();

function getAvatar(username) {
  const key = username.toLowerCase();
  if (!avatarRequests.has(key)) {
    avatarRequests.set(
      key,
      chrome.runtime
        .sendMessage({ type: "resolveAvatar", username })
        .then((res) => res?.url || null)
        .catch(() => null)
    );
  }
  return avatarRequests.get(key);
}

function shouldSkip(node) {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable) return true; // never touch the message composer
    if (el.classList.contains("fbae")) return true; // already processed
  }
  return false;
}

function processTextNode(node) {
  const text = node.nodeValue;
  TOKEN_RE.lastIndex = 0;
  if (!TOKEN_RE.test(text) || shouldSkip(node)) return;

  const frag = document.createDocumentFragment();
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  for (const m of text.matchAll(TOKEN_RE)) {
    if (m.index > last) frag.append(text.slice(last, m.index));
    frag.append(makeToken(m[0], m[1]));
    last = m.index + m[0].length;
  }
  if (last < text.length) frag.append(text.slice(last));
  node.replaceWith(frag);
}

// Shows the original text until the picture resolves, and keeps it if
// the picture can't be found.
function makeToken(raw, username) {
  const span = document.createElement("span");
  span.className = "fbae";
  span.textContent = raw;

  getAvatar(username).then((url) => {
    if (!url) return;
    const img = document.createElement("img");
    img.className = "fbae-img";
    img.src = url;
    img.alt = raw;
    img.title = username;
    img.onerror = () => (span.textContent = raw);
    span.replaceChildren(img);
  });
  return span;
}

function scan(root) {
  if (root.nodeType === Node.TEXT_NODE) return processTextNode(root);
  if (root.nodeType !== Node.ELEMENT_NODE) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue.includes("[[") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(processTextNode);
}

// Facebook renders chats dynamically, so batch DOM changes and scan once per frame.
const pending = new Set();
let scheduled = false;

new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "characterData") pending.add(m.target);
    m.addedNodes.forEach((n) => pending.add(n));
  }
  if (!scheduled && pending.size) {
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const nodes = [...pending];
      pending.clear();
      nodes.forEach((n) => n.isConnected && scan(n));
    });
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });

scan(document.body);
