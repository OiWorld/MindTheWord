// Copyright (c) 2011-2013 Bruno Woltzenlogel Paleo. All rights reserved.
// With a little help of these awesome guys, https://github.com/OiWorld/MindTheWord/graphs/contributors!

var sl, tl, customURLs;

function insertCSS(cssStyle) {
  var cssText = document.createTextNode("<!-- span.translatedWord {" + cssStyle + "} -->"),
      css = document.createElement('style');
  css.setAttribute("id","MindTheWordStyles");
  css.setAttribute("title","MindTheWordStyles");
  css.setAttribute("type","text/css");
  css.setAttribute("media","all");
  document.getElementsByTagName("head")[0].appendChild(css).appendChild(cssText);

  var s = document.createElement("script");
  s.setAttribute("src", customURLs[0]);
  document.getElementsByTagName("head")[0].appendChild(s);

  var styles = [customURLs[1], customURLs[2], customURLs[3]];
  for(var s in styles){
    var css = document.createElement("link"); 
    css.setAttribute("rel","stylesheet"); css.setAttribute("type","text/css"); css.setAttribute("media","all"); css.setAttribute("href",styles[s]);
    document.getElementsByTagName("head")[0].appendChild(css);
  }

  var infoBox = document.createElement("div");
  infoBox.setAttribute("id","MindTheInfoBox");
  document.getElementsByTagName("body")[0].appendChild(infoBox);

/*
  if(!window.jQuery){
    var s = document.createElement("script");
    s.setAttribute("src", customURLs[4]);
    document.getElementsByTagName("head")[0].appendChild(s);
  }
*/
}

function requestTranslations(sourceWords, callback) {
  chrome.extension.sendRequest({wordsToBeTranslated : sourceWords }, function(response) {
      callback(response.translationMap);
  });
}

function deepHTMLReplacement(node, tMap, iTMap){
  if (node.nodeType == Node.TEXT_NODE) {
    var newNodeValue = replaceAll(node.nodeValue, tMap);
    if (newNodeValue != node.nodeValue) {
      node.nodeValue = newNodeValue;
      var parent = node.parentNode;
      parent.innerHTML = replaceAll(parent.innerHTML, iTMap);     
    }
  }
  else if (node.nodeType == Node.ELEMENT_NODE && node.tagName != 'TEXTAREA' && node.tagName != 'INPUT' && node.tagName != 'SCRIPT' && node.tagName != 'CODE') {
    var child = node.firstChild;
    while (child){
        deepHTMLReplacement(child,tMap,iTMap);
        child = child.nextSibling;
    }
  }
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// ToDo: This should be improved. The use of spaces is an ugly hack. 
function replaceAll(text, translationMap) {
  var rExp = "";
  for (var sourceWord in translationMap) {
    rExp += "(\\s" + escapeRegExp(sourceWord) + "\\s)|";
  }
  rExp = rExp.substring(0,rExp.length - 1);
  var regExp = new RegExp(rExp,"gm");
  var newText = text.replace(regExp, function (m) {
    
    if (translationMap[m.substring(1, m.length - 1)] !== null) {
      return " " + translationMap[m.substring(1,m.length - 1)] + " ";
    }
    else {
      return " " + m + " ";
    }
  });

  return newText;
}

function invertMap(map) {
  var iMap = {};
  for (e in map) { 
    iMap[map[e]] = '<span data-sl="'+ sl +'" data-tl="'+ tl +'" data-query="'+ e +'" data-phonetic="" data-sound="" class="translatedWord">' + map[e] + '</span>'; 
  }
  return iMap;
}

function containsIllegalCharacters(s) { return /[0-9{}.,;:]/.test(s); }

function processTranslations(translationMap, userDefinedTMap) { 
  var filteredTMap = {};
  for (w in translationMap) {
    if (w != translationMap[w] && translationMap[w] != "" && !userDefinedTMap[w] && !containsIllegalCharacters(translationMap[w])) {
      filteredTMap[w] = translationMap[w];
    }
  }
  for (w in userDefinedTMap) {
    if (w != userDefinedTMap[w]) {
      filteredTMap[w] = userDefinedTMap[w];
    }
  }
  if (length(filteredTMap) != 0) {
    deepHTMLReplacement(document.body, filteredTMap, invertMap(filteredTMap)); 
  }
}

function length(associativeArray) {
  var l = 0;
  for (e in associativeArray) { l++; }
  return l;     	
}

// More precise than the old one
function filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords) {
  var sourceWords = {},
      userBlacklistedWords = new RegExp(userBlacklistedWords);

  while(length(sourceWords) <= Math.floor((length(countedWords) * translationProbability) / 100)){
    var word = pickRandomProperty(countedWords);
    if(word != "" && !/\d/.test(word) && word.length >= minimumSourceWordLength && !userBlacklistedWords.test(word.toLowerCase()) && !(word in sourceWords)){
      sourceWords[word] = countedWords[word];
    }
  }
  console.log("Translating", Math.floor((length(countedWords) * translationProbability) / 100), "of", length(countedWords), "words (Roughly", JSON.parse(translationProbability), "percent)");
  return sourceWords;
}

// http://stackoverflow.com/a/2532251/754471
function pickRandomProperty(obj) {
  var result;
  var count = 0;
  for (var prop in obj){
    if (Math.random() < 1/++count){
      result = prop;
    }
  }
  return result;
}

function main(translationProbability, minimumSourceWordLength, userDefinedTranslations, userBlacklistedWords) {
  var words = document.body.innerText.split(/\s|,|[.()]|\d/g);
  var countedWords = {}
  for (index in words) {
    if (countedWords[words[index]]) {
      countedWords[words[index]] += 1;
    }
    else {
      countedWords[words[index]] = 1;
    }
  }
  requestTranslations(filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords),
          function(tMap) {processTranslations(tMap, userDefinedTranslations);}); 
}

chrome.extension.sendRequest({getOptions : "Give me the options chosen by the user..." }, function(r) {
  var blacklist = new RegExp(r.blacklist);
  sl = r.sourceLanguage;
  tl = r.targetLanguage;
  customURLs = r.MindTheInjection;
  if (r.activation == "true" && !blacklist.test(document.URL)) {
    insertCSS(r.translatedWordStyle);
    chrome.extension.sendRequest({runMindTheWord: "Pretty please?"}, function(){
      main(r.translationProbability, r.minimumSourceWordLength, JSON.parse(r.userDefinedTranslations), r.userBlacklistedWords);
    })
  }
});
