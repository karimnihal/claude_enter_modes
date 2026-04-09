let mode = "ctrlToSend";
let synthetic = false;

browser.storage.local.get("mode").then((r) => {
  if (r.mode) mode = r.mode;
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.mode) mode = changes.mode.newValue;
});

function getEditableFromEvent(e) {
  const path = typeof e.composedPath === "function" ? e.composedPath() : [];
  for (const node of path) {
    if (!(node instanceof Element)) continue;
    if (node.isContentEditable) return node;
    if (node.matches("textarea, input, [role='textbox']")) return node;
  }

  if (e.target instanceof Element) {
    if (e.target.isContentEditable) return e.target;
    return e.target.closest(
      "textarea, input, [contenteditable='true'], [role='textbox']"
    );
  }

  return null;
}

function isMainComposer(el) {
  const editables = document.querySelectorAll(
    "[contenteditable]:not([contenteditable='false']), textarea, [role='textbox']"
  );
  if (editables.length <= 1) return true;
  const last = editables[editables.length - 1];
  return el === last || el.contains(last) || last.contains(el);
}

function dispatchShiftEnter(target) {
  synthetic = true;
  const opts = {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    which: 13,
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  };
  target.dispatchEvent(new KeyboardEvent("keydown", opts));
  target.dispatchEvent(new KeyboardEvent("keypress", opts));
  target.dispatchEvent(new KeyboardEvent("keyup", opts));
  synthetic = false;
}

function clickSendButton(nearEl) {
  const form = nearEl ? nearEl.closest("form") : null;
  const selectors = [
    'button[aria-label*="Send" i]:not([disabled])',
    'button[data-testid*="send" i]:not([disabled])',
    'button[type="submit"]:not([disabled])',
  ];

  if (form) {
    for (const sel of selectors) {
      const btn = form.querySelector(sel);
      if (btn instanceof HTMLElement) {
        btn.click();
        return true;
      }
    }
  }

  for (const sel of selectors) {
    const btn = document.querySelector(sel);
    if (btn instanceof HTMLElement) {
      btn.click();
      return true;
    }
  }
  return false;
}

function clickSaveButton() {
  const buttons = document.querySelectorAll("button:not([disabled])");
  for (const btn of buttons) {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes("save")) {
      btn.click();
      return true;
    }
  }
  return false;
}

document.addEventListener(
  "contextmenu",
  (e) => {
    if (mode !== "ctrlToSend") return;
    if (!e.ctrlKey) return;
    const field = getEditableFromEvent(e);
    if (field) e.preventDefault();
  },
  true
);

document.addEventListener(
  "keydown",
  (e) => {
    if (synthetic) return;
    if (e.key !== "Enter") return;
    if (e.altKey) return;

    const field = getEditableFromEvent(e);
    if (!field) return;

    const actionMod = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const plain = !actionMod && !shift;
    const inComposer = isMainComposer(field);

    if (mode === "enterToSend") return;

    if (mode === "ctrlToSend") {
      if (actionMod) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inComposer) {
          clickSendButton(field);
        } else {
          clickSaveButton();
        }
      } else if (plain) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inComposer) {
          dispatchShiftEnter(field);
        } else {
          document.execCommand("insertLineBreak");
        }
      }
      // Shift+Enter: let through (native newline)
      return;
    }

    if (actionMod) return;

    if (mode === "shiftToSend") {
      if (plain) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inComposer) {
          dispatchShiftEnter(field);
        } else {
          document.execCommand("insertLineBreak");
        }
      } else if (shift) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inComposer) {
          clickSendButton(field);
        } else {
          clickSaveButton();
        }
      }
      return;
    }

    if (mode === "mouseOnly") {
      if (plain) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (inComposer) {
          dispatchShiftEnter(field);
        } else {
          document.execCommand("insertLineBreak");
        }
      }
      // Shift+Enter: let through (native newline in both composer and editor)
    }
  },
  true
);
