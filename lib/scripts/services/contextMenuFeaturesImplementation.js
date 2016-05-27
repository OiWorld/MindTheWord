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

export function addUrlToBlacklist(tabURL){
  var updatedBlacklist;
  chrome.storage.local.get('blacklist', function(result) {
    var currentBlacklist = result.blacklist;
    var blacklistURLs = [];
    blacklistURLs = currentBlacklist.slice(1, -1).split('|');
    var re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
    var domainNameFromTabURL = tabURL.match(re)[0];
    //to avoid duplication
    updatedBlacklist = '';
    if (blacklistURLs.indexOf(domainNameFromTabURL + '*') == -1) {
      //incase of empty current black list
      if (!currentBlacklist) {
        updatedBlacklist = '(' + domainNameFromTabURL + '*)';
      } else {
        updatedBlacklist = currentBlacklist.split(')')[0] + '|' + domainNameFromTabURL + '*)';
      }
    }
    chrome.storage.local.set({'blacklist': updatedBlacklist});
  });

}

export function addWordToBlacklist(wordToBeBlacklisted){
  if (wordToBeBlacklisted.indexOf(' ') > 0) {
      alert('Please select a single word only. Phrases such as: "' + wordToBeBlacklisted + '" aren\'t allowed');
      return;
  }
  chrome.storage.local.get('userBlacklistedWords', function(result) {
    var currentUserBlacklistedWords = result.userBlacklistedWords;
    var blacklistedWords = [];
    blacklistedWords =  currentUserBlacklistedWords.slice(1,-1).split('|');
    var updatedBlacklistedWords = '';
    //to avoid duplication
    if (blacklistedWords.indexOf(wordToBeBlacklisted) == -1) {
      //incase of empty current black list
      if (!currentUserBlacklistedWords) {
        updatedBlacklistedWords = '(' +  wordToBeBlacklisted + ')';
      } else {
        updatedBlacklistedWords = currentUserBlacklistedWords.split(')')[0] + '|' + wordToBeBlacklisted + ')';
      }
    }
    chrome.storage.local.set({'userBlacklistedWords': updatedBlacklistedWords});
  });
}
