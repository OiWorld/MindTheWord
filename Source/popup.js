function toggleWords() {
  chrome.tabs.executeScript(null, {code:"__mindtheword.toggleAllElements();"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('languageToggle').addEventListener('click', toggleWords);
});
