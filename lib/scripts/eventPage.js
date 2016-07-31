import { ContextMenu } from './services/contextMenu';
import { localData } from './utils/defaultStorage';

var contextMenu = new ContextMenu(),
  translatedWords = {},
  activeContextMenuIds = ['speakTheWord', 'blacklistWord', 'blacklistWebsite', 'saveTranslationToDictionary', 'searchForSimilarWords', 'wordUsageExamples', 'difficultyBucketFeatures', 'markAsLearnt', 'translateSentence', 'whitelistWebsite', 'visualHints'];

/**
 * Set up default data and store it in `chrome.storage.localData`
 */
function initializeLocalStorage() {
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
    'title': 'Speak The Word',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'speakTheWord'
  });
  chrome.contextMenus.create({
    'title': 'Blacklist Selected Word',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'blacklistWord'
  });
  chrome.contextMenus.create({
    'title': 'Blacklist Website',
    'parentId': 'parent',
    'contexts': ['page', 'selection'],
    'id': 'blacklistWebsite'
  });
  chrome.contextMenus.create({
    'title': 'Whitelist Website',
    'parentId': 'parent',
    'contexts': ['page', 'selection'],
    'id': 'whitelistWebsite'
  });
  chrome.contextMenus.create({
    'title': 'Save Translation to Dictionary',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'saveTranslationToDictionary'
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
    'title': 'Show Word Usage Examples',
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
    'id': 'difficultyBucketFeatures'
  });
  chrome.contextMenus.create({
    'title': 'Easy',
    'parentId': 'difficultyBucketFeatures',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucketEasy'
  });
  chrome.contextMenus.create({
    'title': 'Normal',
    'parentId': 'difficultyBucketFeatures',
    'contexts': ['selection'],
    'id': 'addToDifficultyBucketNormal'
  });
  chrome.contextMenus.create({
    'title': 'Hard',
    'parentId': 'difficultyBucketFeatures',
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
  chrome.contextMenus.create({
    'title': 'Remove From Bucket',
    'parentId': 'difficultyBucketFeatures',
    'contexts': ['selection'],
    'id': 'removeFromDifficultyBucket'
  });
  chrome.contextMenus.create({
    'title': 'Show Visual Hints',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'visualHints'
  });
}

/**
 * Enable or disable all context menus
 * @param {boolean} value - true or false
 */
function setContextMenus(value) {
  for (let id in activeContextMenuIds) {
    chrome.contextMenus.update(activeContextMenuIds[id], {
      enabled: value
    });
  }
}

/**
 * Enable or disable whitelist website context menu
 * @param {boolean} value - true or false
 */
function setWhitelist(value) {
  chrome.contextMenus.update('whitelistWebsite', {
    enabled: value
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
      setContextMenus(false);
    } else if (blacklistWebsiteReg.test(url)) {
      setContextMenus(false);
      setWhitelist(true);
    } else if (/^\s*$/.test(url) === true) {
      setContextMenus(false);
    } else {
      setContextMenus(true);
      setWhitelist(false);
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
  if (changeInfo.url || changeInfo.status === 'complete') {
    if (/chrome.*\:\/\//.test(changeInfo.url) === false) {
      updateContextMenu(changeInfo.url);
    } else {
      setContextMenus(false);
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
      setContextMenus(false);
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
    switch (info.menuItemId) {
      case 'blacklistWebsite':
        contextMenu.addUrlToBlacklist(tabURL);
        setContextMenus(false);
        setWhitelist(true);
        break;
      case 'blacklistWord':
        contextMenu.addWordToBlacklist(info.selectionText);
        break;
      case 'searchForSimilarWordsOnThesaurus':
        contextMenu.searchForSimilarWords(info.selectionText, 'thesaurus');
        break;
      case 'searchForSimilarWordsOnGoogle':
        contextMenu.searchForSimilarWords(info.selectionText, 'google');
        break;
      case 'searchForSimilarWordsOnBing':
        contextMenu.searchForSimilarWords(info.selectionText, 'bing');
        break;
      case 'searchForSimilarWordsOnGoogleImages':
        contextMenu.searchForSimilarWords(info.selectionText, 'googleImages');
        break;
      case 'speakTheWord':
        contextMenu.speakTheWord(info.selectionText);
        break;
      case 'addToDifficultyBucketEasy':
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
            if (response) {
              contextMenu.addToDifficultyBucket(info.selectionText, 'e', response.translatedWords);
            }
          });
        });
        break;
      case 'addToDifficultyBucketNormal':
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
            if (response) {
              contextMenu.addToDifficultyBucket(info.selectionText, 'n', response.translatedWords);
            }
          });
        });
        break;
      case 'addToDifficultyBucketHard':
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, (response) => {
            if (response) {
              contextMenu.addToDifficultyBucket(info.selectionText, 'h', response.translatedWords);
            }
          });
        });
        break;
      case 'removeFromDifficultyBucket':
        contextMenu.removeFromDifficultyBucket(info.selectionText);
        break;
      case 'wordUsageExamplesYourDictionary':
        contextMenu.searchForWordUsageExamples(info.selectionText, 'yourdictionary.com');
        break;
      case 'wordUsageExamplesManyThings':
        contextMenu.searchForWordUsageExamples(info.selectionText, 'manythings.org');
        break;
      case 'wordUsageExamplesUseInASentence':
        contextMenu.searchForWordUsageExamples(info.selectionText, 'use-in-a-sentence.com');
        break;
      case 'markAsLearnt':
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
            if (response) {
              contextMenu.markWordAsLearnt(info.selectionText, response.translatedWords);
            }
          });
        });
        break;
      case 'translateSentence':
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
        break;
      case 'saveTranslationToDictionary':
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'getTranslatedWords',
            action: 'storeSelection'
          }, (response) => {
            if (response) {
              contextMenu.saveTranslationToDictionary(info.selectionText, response.translatedWords);
            }
          });
        });
        break;
      case 'whitelistWebsite':
        contextMenu.whitelistURL(tabURL);
        setContextMenus(true);
        setWhitelist(false);
        break;
      case 'visualHints':
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'getTranslatedWords',
            action: 'storeSelection'
          }, (response) => {
            if (response) {
              contextMenu.showVisualHints(info.selectionText, response.translatedWords);
            }
          });
        });
        break;
      default:
        console.error('Wrong context menu id');
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
