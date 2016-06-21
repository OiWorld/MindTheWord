import { ContextMenu } from './services/contextMenu';
import { localData } from './utils/defaultStorage';

var contextMenu = new ContextMenu(),
  translatedWords = {};

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
    'title': 'SpeakTheWord',
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
    'title': 'Blacklist This Website',
    'parentId': 'parent',
    'contexts': ['page', 'selection'],
    'id': 'blacklistWebsite'
  });
  chrome.contextMenus.create({
    'title': 'Save Translation To Dictionary',
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
      contextMenu.addWordToBlacklist(info.selectionText);
    } else if (info.menuItemId === "searchForSimilarWordsOnThesaurus") {
      contextMenu.searchForSimilarWords(info.selectionText, 'thesaurus');
    } else if (info.menuItemId === "searchForSimilarWordsOnGoogle") {
      contextMenu.searchForSimilarWords(info.selectionText, 'google');
    } else if (info.menuItemId === "searchForSimilarWordsOnBing") {
      contextMenu.searchForSimilarWords(info.selectionText, 'bing');
    } else if (info.menuItemId === "searchForSimilarWordsOnGoogleImages") {
      contextMenu.searchForSimilarWords(info.selectionText, 'googleImages');
    } else if (info.menuItemId === "speakTheWord") {
      contextMenu.speakTheWord(info.selectionText);
    } else if (info.menuItemId === "addToDifficultyBucketEasy") {
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
    } else if (info.menuItemId === "addToDifficultyBucketNormal") {
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
    } else if (info.menuItemId === "addToDifficultyBucketHard") {
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
    } else if (info.menuItemId === "removeFromDifficultyBucket"){
      contextMenuFeatures.removeFromDifficultyBucket(info.selectionText);
    } else if (info.menuItemId === "wordUsageExamplesYourDictionary") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'yourdictionary.com');
    } else if (info.menuItemId === "wordUsageExamplesManyThings") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'manythings.org');
    } else if (info.menuItemId === "wordUsageExamplesUseInASentence") {
      contextMenu.searchForWordUsageExamples(info.selectionText, 'use-in-a-sentence.com');
    } else if (info.menuItemId === "markAsLearnt") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
            if (response) {
              contextMenu.markWordAsLearnt(info.selectionText, response.translatedWords);
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
    else if (info.menuItemId === "saveTranslationToDictionary"){
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
