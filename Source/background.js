function initializeLocalStorage() {
  if (localStorage["activation"] == null) {
    localStorage["activation"] = "true";
    localStorage["sourceLanguage"] = "en";
    localStorage["targetLanguage"] = "ru";
    localStorage["translationProbability"] = 15;
    localStorage["minimumSourceWordLength"] = 3;
    localStorage["translatedWordStyle"] = "color : #FE642E ;\nfont-style : normal ;";
    localStorage["userDefinedTranslations"] = '{"the":"the", "a":"a"}';
    localStorage["translationTimeout"] = 50;	
  } 
}
initializeLocalStorage();

function S(key) { return localStorage[key]; } 


function googleTranslateURL() {
    var url = 'http://translate.google.com/translate_a/t?client=f&otf=1&pc=0&hl=en';
    var sL = S("sourceLanguage");
    if(sL != 'auto') {
      url += '&sl=' + sL;
    }
    url += '&tl=' + S("targetLanguage");
    url += '&text=';
    return url;
}	


function translateOneRequestPerFewWords(words, callback) {
  var concatWords = "";
  var trueLength = 0
  var concatWordsArray = {};
  var cWALength = 0;
  var maxLength = 800;
  for (word in words) {
    var wordTrueLength = encodeURIComponent(word + ". ").length;
    if (trueLength + wordTrueLength > maxLength) {
      cWALength++;
//    alert(concatWords + " " + cWALength);
      concatWordsArray[cWALength] = concatWords;
      concatWords = "";
      trueLength = 0;
    }
    concatWords += word + ". "  ;
    trueLength += wordTrueLength; 
  }
  var tMap = {};
  translateORPFWRec(concatWordsArray,1,cWALength,tMap,callback);
}

function translateORPFWRec(concatWordsArray, index, length, tMap,callback) {
  if (index > length) callback(tMap)
  else { 
    var url = googleTranslateURL() + concatWordsArray[index];
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
        translateORPFWRec(concatWordsArray, index + 1, length, tMap, callback);
      }
    }
    xhr.send();
  }
}  	

	
function onRequest(request, sender, sendResponse) {
  if (request.wordsToBeTranslated) {
    translateOneRequestPerFewWords(request.wordsToBeTranslated, function(tMap) {
      sendResponse({translationMap : tMap});
    });
  } else if (request.getOptions) {
    sendResponse({translationProbability : S("translationProbability"),
                  minimumSourceWordLength : S("minimumSourceWordLength"),
                  translatedWordStyle : S("translatedWordStyle"),
                  userDefinedTranslations : S("userDefinedTranslations"),
                  activation : S("activation")});
  } else if (request.getTranslationTimeout) {
    sendResponse({translationTimeout : S("translationTimeout")});
  }
};

chrome.extension.onRequest.addListener(onRequest);

function browserActionClicked() {
  chrome.tabs.create({url:chrome.extension.getURL("options.html")});
}

chrome.browserAction.onClicked.addListener(browserActionClicked);

google_analytics('UA-1471148-13')

//alert("background end")