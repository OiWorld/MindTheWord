import { ContextMenu } from './services/contextMenu'

var contextMenu = new ContextMenu(),
  translatedWords = {};

/**
 * Set up default data and store it in `chrome.storage.localData`
 */
function initializeLocalStorage() {
  let localData = {
    initialized: true,
    activation: true,
    blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
    savedPatterns: JSON.stringify([
      [
        ['en', 'English'],
        ['it', 'Italian'], '25', true, 'Yandex'
      ],
      [
        ['en', 'English'],
        ['de', 'German'], '15', false, 'Yandex'
      ]
    ]),
    sourceLanguage: 'en',
    targetLanguage: 'it',
    translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
    userBlacklistedWords: '(this|that)',
    translationProbability: 15,
    minimumSourceWordLength: 3,
    ngramMin: 1,
    ngramMax: 1,
    userDefinedTranslations: '{"the":"the", "a":"a"}',
    translatorService: 'Yandex',
    yandexTranslatorApiKey: '',
    googleTranslatorApiKey: '',
    bingTranslatorApiKey: '',
    playbackOptions: '{"volume": 1.0, "rate": 1.0, "voiceName": "Google US English", "pitch": 0.5 }',
    // format: {targetLanguage: {word1: E/N/H, word2: E/N/H}}
    // E -> easy, N -> normal, H -> hard
    difficultyBuckets: '{}',
    learntWords:'()'
  };
  chrome.storage.local.set(localData);
}

/**
 * Setup local data storage and context menus
 */
function setup() {
  initializeLocalStorage();
  chrome.contextMenus.create({
    'title': 'MindTheWord',
    'id': 'parent',
    'contexts': ['selection', 'page']
  });
  chrome.contextMenus.create({
    'title': 'SpeakTheWord',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'speakTheWord'
  });
  chrome.contextMenus.create({
    'title': 'Blacklist selected word',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'blacklistWord'
  });
  chrome.contextMenus.create({
    'title': 'Blacklist this website',
    'parentId': 'parent',
    'contexts': ['page', 'selection'],
    'id': 'blacklistWebsite'
  });
  chrome.contextMenus.create({
    'title': 'Save word to dictionary',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'saveWord'
  });
  chrome.contextMenus.create({
    'title': 'Search For Similar Words',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'searchForSimilarWords'
  });
  chrome.contextMenus.create({
    'title': 'Google Search',
    'parentId': 'searchForSimilarWords',
    'contexts': ['selection'],
    'id': 'searchForSimilarWordsOnGoogle'
  });
  chrome.contextMenus.create({
    'title': 'Bing Search',
    'parentId': 'searchForSimilarWords',
    'contexts': ['selection'],
    'id': 'searchForSimilarWordsOnBing'
  });
  chrome.contextMenus.create({
    'title': 'Google Image Search',
    'parentId': 'searchForSimilarWords',
    'contexts': ['selection'],
    'id': 'searchForSimilarWordsOnGoogleImages'
  });
  chrome.contextMenus.create({
    'title': 'Thesaurus.com',
    'parentId': 'searchForSimilarWords',
    'contexts': ['selection'],
    'id': 'searchForSimilarWordsOnThesaurus'
  });
  chrome.contextMenus.create({
    'title': 'Selected Word Usage Examples',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'wordUsageExamples'
  });
  chrome.contextMenus.create({
    'title': 'yourdictionary.com',
    'parentId': 'wordUsageExamples',
    'contexts': ['selection'],
    'id': 'wordUsageExamplesYourDictionary'
  });
  chrome.contextMenus.create({
    'title': 'use-in-a-sentence.com',
    'parentId': 'wordUsageExamples',
    'contexts': ['selection'],
    'id': 'wordUsageExamplesUseInASentence'
  });
  chrome.contextMenus.create({
    'title': 'manythings.org',
    'parentId': 'wordUsageExamples',
    'contexts': ['selection'],
    'id': 'wordUsageExamplesManyThings'
  });
  chrome.contextMenus.create({
    'title': 'Add To Difficulty Bucket',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucket'
  });
  chrome.contextMenus.create({
    'title': 'Easy',
    'parentId': 'addToDifficultyBucket',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucketEasy'
  });
  chrome.contextMenus.create({
    'title': 'Normal',
    'parentId': 'addToDifficultyBucket',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucketNormal'
  });
  chrome.contextMenus.create({
    'title': 'Hard',
    'parentId': 'addToDifficultyBucket',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucketHard'
  });
  chrome.contextMenus.create({
    'title': 'Mark as Learnt',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'markAsLearnt'
  });
  chrome.contextMenus.create({
    'title': 'Translate Sentence',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'translateSentence'
  });
}

/**
 * Disable context menu
 */
function disableContextMenus() {
  chrome.contextMenus.update('parent', {
    enabled: false
  });
}

/**
 * Enable context Menu
 */
function enableContextMenus() {
  chrome.contextMenus.update('parent', {
    enabled: true
  });
}

/**
 * Update context menu according to page
 * @param {string} url - active tab URL
 */
function updateContextMenu(url) {
  chrome.storage.local.get(['activation', 'blacklist'], (result) => {
    var blacklistWebsiteReg = new RegExp(result.blacklist),
      activation = result.activation;
    if (activation === false) {
      disableContextMenus();
    } else if (blacklistWebsiteReg.test(url)) {
      disableContextMenus();
    } else if (/^\s*$/.test(url) === true) {
      disableContextMenus();
    } else {
      enableContextMenus();
    }
  });
}

/**
 * Checks if URL is changed. Call `updateContextMenu` if
 * new URL is not blank or chrome URL.
 * @param {Integer} tabId - tab identifier
 * @param {Object} changeInfo - change information
 * @param {Object} tab - tab information
 */
function checkURLChange(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (/chrome.*\:\/\//.test(changeInfo.url) === false) {
      updateContextMenu(changeInfo.url);
    } else {
      disableContextMenus();
    }
  }
}

/**
 * Checks the current active tab has a valid URL and
 * calls `updateContextMenu` if true.
 * @param {Object} activeInfo - information about active tab
 */
function checkActiveTabChange(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (/chrome.*\:\/\//.test(tab.url) === false) {
      updateContextMenu(tab.url);
    } else {
      disableContextMenus();
    }
  });
}

/**
 * Click event handler for context menu. Calls appropriate
 * functions from ContextMenu class.
 * @param {Object} info -
 * @param {Object} tabs -
 */
function contextMenuClickHandler(info, tab) {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, (tabs) => {
    var tabURL = tabs[0].url;
    if (info.menuItemId == "blacklistWebsite") {
      contextMenu.addUrlToBlacklist(tabURL);
      disableContextMenus();
    } else if (info.menuItemId == "blacklistWord") {
      contextMenu.addWordToBlacklist(info.selectionText, tabURL);
    } else if (info.menuItemId === "saveWord") {
      // selectedText = info.selectionText;
      // var translation = currentTranslatedMap[selectedText];
      // if (currentTranslatedMap[selectedText]) {
      //   console.log('To save:' + selectedText);
      //   chrome.runtime.sendMessage({updateUserDictionary: 'Add word to dictionary', word: selectedText, translation: translation}, function(r) {});
      // }
      // else {
      //   alert('Please select translated word. "' + selectedText + '" is not translated.'  );
      // }
    } else if (info.menuItemId === "searchForSimilarWordsOnThesaurus") {
      contextMenu.searchForSimilarWords(info.selectionText, 'thesaurus', tabURL);
    } else if (info.menuItemId === "searchForSimilarWordsOnGoogle") {
      contextMenu.searchForSimilarWords(info.selectionText, 'google', tabURL);
    } else if (info.menuItemId === "searchForSimilarWordsOnBing") {
      contextMenu.searchForSimilarWords(info.selectionText, 'bing', tabURL);
    } else if (info.menuItemId === "searchForSimilarWordsOnGoogleImages") {
      contextMenu.searchForSimilarWords(info.selectionText, 'googleImages', tabURL);
    } else if (info.menuItemId === "speakTheWord") {
      contextMenu.speakTheWord(info.selectionText, tabURL);
    } else if (info.menuItemId === "addToDifficultyBucketEasy") {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
          if (response) {
            contextMenu.addToDifficultyBucket(info.selectionText, 'e', response.translatedWords, tabURL);
          }
        });
      });
    } else if (info.menuItemId === "addToDifficultyBucketNormal") {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
          if (response) {
            contextMenu.addToDifficultyBucket(info.selectionText, 'n', response.translatedWords, tabURL);
          }
        });
      });
    } else if (info.menuItemId === "addToDifficultyBucketHard") {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
          if (response) {
            contextMenu.addToDifficultyBucket(info.selectionText, 'h', response.translatedWords, tabURL);
          }
        });
      });
    } else if (info.menuItemId === "wordUsageExamplesYourDictionary") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'yourdictionary.com', tabURL);
    } else if (info.menuItemId === "wordUsageExamplesManyThings") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'manythings.org', tabURL);
    } else if (info.menuItemId === "wordUsageExamplesUseInASentence") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'use-in-a-sentence.com', tabURL);
    } else if (info.menuItemId === "markAsLearnt") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
            if (response) {
              contextMenu.markWordAsLearnt(info.selectionText, response.translatedWords, tabURL);
            }
        });
      });
    } else if (info.menuItemId === "translateSentence") {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'getTranslatedWords',
          action: 'storeSelection'
        }, (response) => {
          if (response) {
            contextMenu.translateSentence(info.selectionText, response.translatedWords)
              .then((translationData) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                  type: 'showTranslatedSentence',
                  data: translationData
                });
              })
              .catch((e) => {
                console.error('Error in obtaining translations', e);
              });
          }
        });
      });
    }
  });
}

//On first installation, load default Data and initialize context menu
chrome.runtime.onInstalled.addListener(setup);

// context menu handlers
chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);

// update context menu if URL is changed
chrome.tabs.onUpdated.addListener(checkURLChange);

// update context menu if active tab is changed
chrome.tabs.onActivated.addListener(checkActiveTabChange);
