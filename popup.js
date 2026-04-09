const DEFAULT_MODE = "shiftToSend";

async function init() {
  const radios = document.querySelectorAll('input[name="mode"]');
  if (!radios.length) return;

  const stored = await browser.storage.local.get("mode");
  const mode = stored.mode || DEFAULT_MODE;

  const selected = document.querySelector(`input[name="mode"][value="${mode}"]`);
  if (selected) {
    selected.checked = true;
  }

  for (const radio of radios) {
    radio.addEventListener("change", async (e) => {
      if (!e.target.checked) return;
      await browser.storage.local.set({ mode: e.target.value });
    });
  }
}

init().catch(() => {
  // Keep popup resilient in case storage isn't available.
});
