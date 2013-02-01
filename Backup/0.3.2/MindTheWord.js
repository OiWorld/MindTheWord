/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */


function requestTranslations(sourceWords, callback) {
  chrome.extension.sendRequest({wordsToBeTranslated : sourceWords }, function(response) {
    callback(response.translationMap);
  });
}

function deepHTMLReplacement(node, tMap, iTMap){
  if (node.nodeType == 3) {
    var newNodeValue = replaceAll(node.nodeValue, tMap);
    if (newNodeValue != node.nodeValue) {
      node.nodeValue = newNodeValue;
      var parent = node.parentNode;
      parent.innerHTML = replaceAll(parent.innerHTML, iTMap);     
    }
  }
  else {
    var child = node.firstChild;
    while (child){
        deepHTMLReplacement(child,tMap,iTMap);
        child = child.nextSibling;
    }
  }
}

function replaceAll(text, translationMap) {
  var rExp = ""; 
  for (sourceWord in translationMap) {
    rExp += "(\\s" + sourceWord + "\\s)|";
  }
  rExp = rExp.substring(0,rExp.length - 1);
  var regExp = new RegExp(rExp,"gm");
  var newText = text.replace(regExp, function(m){
    if (translationMap[m.substring(1,m.length - 1)] != null) {
      return " " + translationMap[m.substring(1,m.length - 1)] + " ";
    } 
    else {
      return " " + m + " ";
    }
  })
  return newText; 
}

function invertMap(map) {
  var iMap = {};
  for (e in map) { iMap[map[e]] = '<span title="'+ e +'">' + map[e] + '</span>'; }
  return iMap;
}

function processTranslations(translationMap) { 
  var filteredTMap = {};
  for (w in translationMap) {
    if (w != translationMap[w] && translationMap[w] != "") {
      filteredTMap[w] = translationMap[w];
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

function filterSourceWords(countedWords, translationProbability) {
  var sourceWords = {};
  for (word in countedWords) {
    if (word != "" && !/\d/.test(word)) {
      var randomNumber = Math.floor(Math.random()*100)
      if (randomNumber < translationProbability) {
        sourceWords[word] = countedWords[word];
      }
    }     
  }
  return sourceWords;
}

function main() {
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
  
  var translationProbability = 10;
  chrome.extension.sendRequest({translationProbability : "Give me the translation probability chosen by the user in the options page..." }, function(response) {
    translationProbability = response.translationProbability;
    
  });

  requestTranslations(filterSourceWords(countedWords, translationProbability),processTranslations); 
}

setTimeout('main();', 50); 