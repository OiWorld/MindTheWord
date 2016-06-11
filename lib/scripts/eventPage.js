import {BingTranslate} from './services/bingTranslate'
import {ContextMenu} from './services/contextMenu'

console.log('eventPage running');

 var contextMenuFeatures = new ContextMenu(),
 translatedWords;

//sets up default data in localStorage
function setupDefaultData() {
  console.log('Initializing Local Storage');
  var localData = {
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

//On first installation, load default Data and initialize context menu
chrome.runtime.onInstalled.addListener(function() {
  setupDefaultData();
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
    'title': 'Mark As Learnt',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'markAsLearnt'
  });
});

function getCurrentTabURL(){
  var promise = new Promise(function(resolve, reject){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        resolve(tabs[0].url);
    });
  })
}

// context menu handlers
chrome.contextMenus.onClicked.addListener(onClickHandler);
function onClickHandler(info, tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    var tabURL = tabs[0].url;
    if (info.menuItemId == "blacklistWebsite") {
      contextMenuFeatures.addUrlToBlacklist(tabURL);
    } else if (info.menuItemId == "blacklistWord") {
      contextMenuFeatures.addWordToBlacklist(info.selectionText, tabURL);
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
    }
    else if (info.menuItemId === "searchForSimilarWordsOnThesaurus"){
      contextMenuFeatures.searchForSimilarWords(info.selectionText, 'thesaurus', tabURL);
    }
    else if (info.menuItemId === "searchForSimilarWordsOnGoogle"){
      contextMenuFeatures.searchForSimilarWords(info.selectionText, 'google', tabURL);
    }
    else if (info.menuItemId === "searchForSimilarWordsOnBing"){
      contextMenuFeatures.searchForSimilarWords(info.selectionText, 'bing', tabURL);
    }
    else if (info.menuItemId === "searchForSimilarWordsOnGoogleImages"){
      contextMenuFeatures.searchForSimilarWords(info.selectionText, 'googleImages', tabURL);
    }
    else if (info.menuItemId === "speakTheWord"){
      contextMenuFeatures.speakTheWord(info.selectionText, tabURL);
    }
    else if (info.menuItemId === "addToDifficultyBucketEasy"){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
          contextMenuFeatures.addToDifficultyBucket(info.selectionText, 'e', response.translatedWords, tabURL);
        });
      });
    }
    else if (info.menuItemId === "addToDifficultyBucketNormal"){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
          contextMenuFeatures.addToDifficultyBucket(info.selectionText, 'n', response.translatedWords, tabURL);
        });
      });
    }
    else if (info.menuItemId === "addToDifficultyBucketHard"){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
          contextMenuFeatures.addToDifficultyBucket(info.selectionText, 'h', response.translatedWords, tabURL);
        });
      });
    }
    else if (info.menuItemId === "wordUsageExamplesYourDictionary"){
      contextMenuFeatures.searchForWordUsageExamples(info.selectionText, 'yourdictionary.com' ,tabURL);
    }
    else if (info.menuItemId === "wordUsageExamplesManyThings"){
      contextMenuFeatures.searchForWordUsageExamples(info.selectionText, 'manythings.org' ,tabURL);
    }
    else if (info.menuItemId === "wordUsageExamplesUseInASentence"){
      contextMenuFeatures.searchForWordUsageExamples(info.selectionText, 'use-in-a-sentence.com' ,tabURL);
    }
    else if (info.menuItemId === "markAsLearnt"){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'getTranslatedWords'}, function(response){
            contextMenuFeatures.markWordAsLearnt(info.selectionText, response.translatedWords, tabURL);
        });
      });
    }
  });
}

// google_analytics('UA-1471148-13');

console.log('eventPage ended');
