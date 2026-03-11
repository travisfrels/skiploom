const DEFAULT_URL = "http://localhost:5173";

document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("skiploomUrl");
  const saveButton = document.getElementById("save");
  const status = document.getElementById("status");

  chrome.storage.sync.get({ skiploomUrl: DEFAULT_URL }, (result) => {
    urlInput.value = result.skiploomUrl;
  });

  saveButton.addEventListener("click", () => {
    const url = urlInput.value.trim() || DEFAULT_URL;
    chrome.storage.sync.set({ skiploomUrl: url }, () => {
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 2000);
    });
  });
});
