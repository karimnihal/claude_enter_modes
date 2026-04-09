# Claude Enter Key Modes

A Firefox extension that lets you choose how the **Enter** key behaves on [claude.ai](https://claude.ai).

## Status / compatibility

- **Last verified working**: **2026-04-09**
- **Support**: This is a small personal project and is **not actively maintained**.
- **Warning**: Claude.ai UI changes or Firefox extension/platform changes may break this extension or change its behavior over time.

## Modes

| Mode | Enter | Shift+Enter |
|------|-------|-------------|
| **Enter sends** | Send message | New line |
| **Shift+Enter sends** (default) | New line | Send message |
| **Mouse click only** | New line | New line |

All three modes apply to both the main composer and the inline message editor.

## Install

### From source (temporary)

1. Clone or download this repo.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...** and select `manifest.json` from this repo.
4. The extension icon appears in the toolbar. Click it to pick a mode.

> Temporary add-ons are removed when Firefox restarts.

### From source (persistent with web-ext)

```bash
npx web-ext run            # launches a fresh profile with the extension loaded
npx web-ext run --devtools # same, but opens devtools automatically
```

### Packaging for distribution

```bash
npx web-ext build   # produces a .zip in web-ext-artifacts/
```

Upload the resulting `.zip` to [addons.mozilla.org](https://addons.mozilla.org) to publish.

## Project structure

```
manifest.json       Extension manifest (Manifest V2, Firefox)
content.js          Injected into claude.ai; handles key interception
popup.html          Settings popup (mode selector)
popup.js            Reads/writes the selected mode to browser.storage
icons/              Extension icons (16/32/48/96 px)
LICENSE             MIT
```

## License

[MIT](LICENSE)
