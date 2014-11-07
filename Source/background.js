console.log("Starting up MindTheWord background page");
var storage = chrome.storage.sync;

function initializeStorage() {
  storage.get("initialized", function(result) {
    if (!(result.initialized)) {
      var data = {
        initialized: true,
        activation: true,
        blacklist: "(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)",
        savedPatterns: JSON.stringify([[["en","English"],["it","Italian"],"25",true], [["en","English"],["la","Latin"],"15",false]]),
        sourceLanguage: "en",
        targetLanguage: "it",
        translatedWordStyle: "font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);",
        userBlacklistedWords: "(this|that)",
        translationProbability: 15,
        minimumSourceWordLength: 3,
        ngramMin: 1,
        ngramMax: 1,
        userDefinedTranslations: '{"the":"the", "a":"a"}',
      };
      console.log("setting defaults: ");
      console.log(data);
      storage.set(data);
    }
  });
}
initializeStorage();


function googleTranslateURL(prefs) {
    var url = 'http://translate.google.com/translate_a/t?client=f&otf=1&pc=0&hl=en';
    var sL = prefs["sourceLanguage"];
    if(sL != 'auto') {
      url += '&sl=' + sL;
    }
    url += '&tl=' + prefs["targetLanguage"];
    url += '&text=';
    return url;
}	


function translateOneRequestPerFewWords(words, prefs, callback) {
  //console.debug("words: " + JSON.stringify(words));
  var concatWords = "";
  var length = 0
  var maxLength = 800;
  var concatWordsArray = {};
  var cWALength = 1;

  for (word in words) {
    //console.debug("word: " + word);
    concatWords += word + ". "  ;
    //console.debug("concatWords: " + concatWords);
    concatWordsArray[cWALength] = concatWords;
    length += encodeURIComponent(word + ". ").length;

    if (length > maxLength) {
      cWALength++;
      concatWords = "";
      length = 0;
    }
  }
  var tMap = {};
  translateORPFWRec(concatWordsArray, 1, cWALength, tMap, prefs, callback);
}

function translateORPFWRec(concatWordsArray, index, length, tMap, prefs, callback) {
  console.log("translateORPFWRec");
  console.debug("concatWordsArray: " + JSON.stringify(concatWordsArray));
  console.debug("index: " + index +  "; length: " + length);
  if (index > length) callback(tMap)
  else { 
    var url = googleTranslateURL(prefs) + concatWordsArray[index];
    var xhr = new XMLHttpRequest(); xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        //alert(xhr.responseText);
        var r = JSON.parse(xhr.responseText);
        for (i in r.sentences) {
          var orig = r.sentences[i].orig;
          var origT = orig.substring(0,orig.length - 1);
	  var trans = r.sentences[i].trans;
          var transT = trans.replace(/[.\u3002]/,""); // removes punctuation
          tMap[origT] = transT;
        }
        translateORPFWRec(concatWordsArray, index + 1, length, tMap, prefs, callback);
      }
    }
    xhr.send();
  }
}  	

function onMessage(request, sender, sendResponse) {
  console.log("onMessage ");
  console.log(request);
  if (request.wordsToBeTranslated) {
    console.log("words to be translated:", request.wordsToBeTranslated);
    storage.get(null, function(prefs) {
      translateOneRequestPerFewWords(request.wordsToBeTranslated, prefs, function(tMap) {
        console.log("translations:", tMap);
        sendResponse({translationMap : tMap});
      });
    });
    //console.log(length(request.wordsToBeTranslated));
  } else if (request.getOptions) {
    storage.get(null, function(data) {
      data.script = [chrome.extension.getURL("/assets/js/mtw.js")];
      console.log("sending getOptions data");
      console.log(data);
      sendResponse(data);
    });
  } else if (request.runMindTheWord) {
    chrome.tabs.onUpdated.addListener(function(tabId, info){ //Wait until page has finished loading
      if(info.status == "complete"){
        console.log(info.status);
        sendResponse(true);
      }
    })
  }
  return true;
};

chrome.runtime.onMessage.addListener(onMessage);

function browserActionClicked() {
  chrome.tabs.create({url:chrome.extension.getURL("options.html")});
}

google_analytics('UA-1471148-13');
console.log("Done setting up MindTheWord background page");
