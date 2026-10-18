<p align="center">
  <img src="docs/preview.jpg" alt="Bring back memes" width="180">
</p>

<h1 align="center">Bring back memes</h1>

<p align="center">
  <b>Turn <code>[[username]]</code> in your Facebook chats into that page's picture, right inside the message.</b><br>
  Type <code>[[fakss]]</code> and it shows up as the profile picture from <code>facebook.com/fakss</code>, like a custom emoji.
</p>

<p align="center">
  <a href="../../releases/latest"><img src="https://img.shields.io/badge/Download-latest%20release-1877F2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Download the latest release" height="40"></a>
</p>

<p align="center">
  <a href="../../releases/latest">Download</a> ·
  <a href="#install">Install</a> ·
  <a href="#using-it">Using it</a> ·
  <a href="#privacy-and-permissions">Privacy</a>
</p>

---

## What you get

**Pictures instead of names.** Any `[[username]]` in a chat on Facebook or Messenger turns into that profile's or page's picture, sitting in the line of text like an emoji. Hover over it to see the name.

**Full square pictures.** The picture is shown as a square, not cropped into a circle, so memes stay readable.

**Works as you scroll.** New messages and older ones you scroll back to are picked up as they appear.

**Your typing stays untouched.** The box you type in is never changed. Your message is sent as plain `[[username]]` text, and only the chat view shows the picture.

**Fast after the first time.** Each picture is looked up once and remembered for 12 hours, so the same name in a hundred messages costs one lookup.

> **Good to know:** only people who have Bring back memes installed see the pictures. Everyone else sees the plain `[[username]]` text.

## Install

Bring back memes is not on the Chrome Web Store, so you load it as an unpacked extension. It takes about a minute and works the same in Chrome, Edge, Brave, Opera and other Chromium browsers.

### From a release (easiest)

1. Download the **`bring-back-memes-vX.Y.Z.zip`** file from the [latest release](../../releases/latest).
2. Unzip it to a folder you will keep. Chrome reads the extension from that folder, so don't delete or move it afterwards.
3. Open the extensions page: `chrome://extensions` in Chrome, `edge://extensions` in Edge, `brave://extensions` in Brave.
4. Turn on **Developer mode** (the switch in the top right).
5. Click **Load unpacked** and choose the unzipped folder, the one that contains `manifest.json`.
6. Reload any open Facebook or Messenger tabs.

### From the source code

Click **Code → Download ZIP** on this page and unzip it, or clone the repository. Then follow steps 3 to 6 above and choose the **`src`** folder inside it.

### Good to know

- **Developer mode warning.** Chrome may remind you at startup that you are running an extension in developer mode. That is normal for unpacked extensions; you can dismiss it.
- **Updating.** Replace the files in your folder with the new version, then press the reload arrow on the extension's card in the extensions page.
- **Uninstalling.** Click **Remove** on its card in the extensions page.
- **Browsers.** It needs a Chromium browser with Manifest V3 support. Firefox and Safari are not supported.

## Using it

| To do this | Do this |
| --- | --- |
| Show someone's picture | Type their Facebook username in double square brackets: `[[fakss]]` |
| Find a username | It's the part after `facebook.com/` in their profile or page address |
| Use several in one message | Just type them: `[[fakss]] [[another.page]]` |
| See whose picture it is | Hover over it |
| Picture not showing? | Check the username is right and that you can open `facebook.com/<username>` yourself. If the picture can't be found, the text stays as it is |

Usernames can contain letters, numbers and dots.

## Privacy and permissions

Bring back memes has no account, no analytics, no ads and no server of its own. It only talks to Facebook.

When it sees a `[[username]]`, it asks Facebook for that profile's picture: first through Facebook's public picture address, and if that doesn't work, by opening `facebook.com/<username>` in the background with your own Facebook session and reading the picture from it. The picture address is saved on your device for 12 hours and is not shared anywhere.

| Permission | Why it is needed |
| --- | --- |
| Access to `facebook.com` and `messenger.com` | Finding `[[username]]` in chats and showing the picture |
| Access to `graph.facebook.com` | Looking up public profile pictures |
| `storage` | Remembering pictures so each one is looked up only once every few hours |

## How it is built

Plain JavaScript and CSS under Manifest V3, with no framework, no dependencies and no build step.

| File | What it does |
| --- | --- |
| `src/manifest.json` | The extension manifest |
| `src/content.js` | Finds `[[username]]` in the chat and swaps it for the picture |
| `src/content.css` | The size and look of the inline pictures |
| `src/background.js` | Looks up profile pictures and caches them |
| `.github/workflows/release.yml` | Builds the download zip whenever a new version is tagged |

## Contributing

Bug reports and ideas are welcome in the [issues](../../issues).

## License

Released under the [MIT License](LICENSE).

<sub>Bring back memes is not affiliated with or endorsed by Meta or Facebook.</sub>
