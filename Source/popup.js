function toggleWords() {
  chrome.tabs.executeScript(null, {code:"__mindtheword.toggleAllElements();"});
  window.close();
}
function options() {
  chrome.tabs.create({url:chrome.extension.getURL("options.html")});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('languageToggle').addEventListener('click', toggleWords);
  document.getElementById('optionsButton').addEventListener('click', options);
});
