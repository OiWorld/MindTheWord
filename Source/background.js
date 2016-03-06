console.log('Starting up MindTheWord background page');
var storage = chrome.storage.local;

// defaultStorage is used if the storage has not been initialized yet.
var defaultStorage = {
  initialized: true,
  activation: true,
  blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
  savedPatterns: JSON.stringify([[['en', 'English'], ['it', 'Italian'], '25', true],
      [['en', 'English'], ['la', 'Latin'], '15', false]]),
  sourceLanguage: 'en',
  targetLanguage: 'it',
  translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
  userBlacklistedWords: '(this|that)',
  translationProbability: 15,
  minimumSourceWordLength: 3,
  ngramMin: 1,
  ngramMax: 1,
  userDefinedTranslations: '{"the":"the", "a":"a"}',
  translatorService: 'Google Translate',
  yandexTranslatorApiKey: ''
};

/**
 * @desc initialize storage if needed
 */
function initializeStorage() {
  storage.get(null, function(storage) {
    if (JSON.stringify(storage) == '{}') {
      console.log('setting storage to defaultStorage: ');
      console.log(JSON.stringify(defaultStorage));
      storage.set(defaultStorage);
    }
  });
}
initializeStorage();

function translateOneRequestPerFewWords(words, prefs, callback) {
  //console.debug("words: " + JSON.stringify(words));
  var concatWords = '';
  var length = 0;
  var maxLength = 800;
  var concatWordsArray = {};
  var cWALength = 1;

  for (word in words) {
    //console.debug("word: " + word);
    concatWords += word + '. ';
    //console.debug("concatWords: " + concatWords);
    concatWordsArray[cWALength] = concatWords;
    length += encodeURIComponent(word + '. ').length;

    if (length > maxLength) {
      cWALength++;
      concatWords = '';
      length = 0;
    }
  }
  var tMap = {};
  translateORPFWRec(concatWordsArray, 1, cWALength, tMap, prefs, callback);
}

var translator = {
  translate: function(prefs, word) {
    }
};

var googleTranslator = function() {
};
googleTranslator.prototype = Object.create(translator);

var yandexTranslator = function() {
};
yandexTranslator.prototype = Object.create(translator);

/**
 * @desc Constructs google translate url
 * @params User saved preferences
 * @params word to be translated
 * @return Google Translate query from source to destination language
 */
googleTranslator.prototype.translate = function(prefs, word, callback) {
  var url = 'http://translate.google.com/translate_a/t?client=f&otf=1&pc=0&hl=en';
  var sL = prefs['sourceLanguage'];
  if (sL != 'auto') {
    url += '&sl=' + sL;
  }
  url += '&tl=' + prefs['targetLanguage'];
  url += '&text=';
  url += word;

  getData(url, function(result) {
    var tMap = {};
    for (var i in result.sentences) {
      var orig = result.sentences[i].orig;
      var origT = orig.substring(0, orig.length - 1);
      var trans = result.sentences[i].trans;
      var transT = trans.replace(/[.\u3002]/, ''); // removes punctuation
      tMap[origT] = transT;
    }
    callback(tMap);
  });
};

yandexTranslator.prototype.translate = function(prefs, word, callback) {
  var apikey = prefs['yandexTranslatorApiKey'];

  var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + apikey;
  url += '&lang=' + prefs['sourceLanguage'] + '-' + prefs['targetLanguage'];

  // currently a hack to create array of words, ideally it would be better to passdown an array of words.
  var words = word.split('.');
  for (var i = 0; i < words.length; i++) {
    url += '&text=' + words[i].trim(' ');
  }

  getData(url, function(result) {
    var tMap = {};
    for (var i = 0; i < words.length; i++) {
      var origT = words[i].trim(' ');
      var transT = result.text[i];
      tMap[origT] = transT;
    }
    callback(tMap);
  });
};

function getData(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

var TranslatorFactory = {
  getTranslator: function(type) {
    }
};

var ConcreteTranslatorFactory = function() {
};

ConcreteTranslatorFactory.prototype = Object.create(TranslatorFactory);
ConcreteTranslatorFactory.prototype.getTranslator = function(type) {
  if (type === 'Google Translate') {
    return new googleTranslator();
  }
  return new yandexTranslator();
};

function translateORPFWRec(concatWordsArray, index, length, tMap, prefs, callback) {
  console.log('translateORPFWRec');
  console.debug('concatWordsArray: ' + JSON.stringify(concatWordsArray));
  console.debug('index: ' + index + '; length: ' + length);
  if (index > length) callback(tMap);
  else {
    new new ConcreteTranslatorFactory().getTranslator(prefs.translatorService).translate(prefs, concatWordsArray[index],
            function(pMap) {
              for (var key in pMap) {
                if (pMap.hasOwnProperty(key)) {
                  tMap[key] = pMap[key];
                }
              }
              translateORPFWRec(concatWordsArray, index + 1, length, tMap, prefs, callback);
            });
  }
}

function onMessage(request, sender, sendResponse) {
  console.log('onMessage ');
  console.log(request);
  if (request.wordsToBeTranslated) {
    console.log('words to be translated:', request.wordsToBeTranslated);
    storage.get(null, function(prefs) {
      translateOneRequestPerFewWords(request.wordsToBeTranslated, prefs, function(tMap) {
        console.log('translations:', tMap);
        sendResponse({translationMap: tMap});
      });
    });
    //console.log(length(request.wordsToBeTranslated));
  } else if (request.getOptions) {
    storage.get(null, function(data) {
      data.script = [chrome.extension.getURL('/assets/js/mtw.js')];
      console.log('sending getOptions data');
      console.log(data);
      sendResponse(data);
    });
  } else if (request.runMindTheWord) {
    chrome.tabs.onUpdated.addListener(function(tabId, info) { //Wait until page has finished loading
      if (info.status == 'complete') {
        console.log(info.status);
        sendResponse(true);
      }
    });
  }
  return true;
}
chrome.runtime.onMessage.addListener(onMessage);

function browserActionClicked() {
  chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

chrome.runtime.onInstalled.addListener(function() {
  var context = 'page';
  var title = 'Blacklist this website';
  var id = chrome.contextMenus.create({'title': title, 'id': 'context' + context});
});

// add click event for context menu
chrome.contextMenus.onClicked.addListener(onClickHandler);

// sends current URL to be added to the blacklist
function onClickHandler(info, tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    chrome.runtime.sendMessage({updateBlacklist: 'Add website to blacklist', tabURL: tabs[0].url}, function(r) {});
  });
};

google_analytics('UA-1471148-13');
console.log('Done setting up MindTheWord background page');
