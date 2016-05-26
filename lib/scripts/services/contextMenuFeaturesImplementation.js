export function searchForSimilarWords(selectedText, searchPlatform ) {
  var searchPlatformURLS = {
    'bing': 'http://www.bing.com/search?q=%s+synonyms&go=&qs=n&sk=&sc=8-9&form=QBLH',
    'google': 'http://www.google.com/#q=%s+synonyms&fp=1',
    'googleImages': 'http://www.google.com/search?num=10&hl=en&site=imghp&tbm=isch&source=hp&q=%s',
    'thesaurus': 'http://www.thesaurus.com/browse/%s?s=t'
  }
  var searchUrl = searchPlatformURLS[searchPlatform];
  selectedText = selectedText.replace(" ", "+");
  searchUrl = searchUrl.replace(/%s/g, selectedText);
  chrome.tabs.create({
     "url":searchUrl
  });
}
