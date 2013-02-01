function injectJS(link) {
  var scr = document.createElement('script');
  scr.type="text/javascript";
  scr.src=link;
  document.getElementsByTagName('head')[0].appendChild(scr);
}
injectJS(chrome.extension.getURL('injected.js'));
