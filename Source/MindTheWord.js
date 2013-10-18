// Copyright (c) 2011-2013 Bruno Woltzenlogel Paleo. All rights reserved.


function insertCSS(cssStyle) {
  var css = document.createElement('style');
  css.setAttribute("id","MindTheWordStyles");
  css.setAttribute("title","MindTheWordStyles");
  css.setAttribute("type","text/css");
  css.setAttribute("media","all");
  document.getElementsByTagName("head")[0].appendChild(css);
  var cssText = document.createTextNode("<!-- span.translatedWord {" + cssStyle + "} -->");
  document.getElementById("MindTheWordStyles").appendChild(cssText);
}


function requestTranslations(sourceWords, callback) {
  //alert("source: " + JSON.stringify(sourceWords) )
  chrome.extension.sendRequest({wordsToBeTranslated : sourceWords }, function(response) {
      //alert("translation: " + JSON.stringify(response.translationMap))
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
  //alert(JSON.stringify(map))
  for (e in map) { iMap[map[e]] = '<span title="'+ e +'" class="translatedWord">' + map[e] + '</span>'; }
  //for (e in map) { iMap[map[e]] = '<span title="'+ e +'" class="translatedWord" style="' + translatedWordStyle + '">' + map[e] + '</span>'; }
  //alert(JSON.stringify(iMap))
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
  //alert(userDefinedTMap)
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

function filterSourceWords(countedWords, translationProbability, minimumSourceWordLength) {
  var sourceWords = {};
  for (word in countedWords) {
    if (word != "" && !/\d/.test(word) && word.length >= minimumSourceWordLength) {
      var randomNumber = Math.floor(Math.random()*100)
      // Ugly hack: translation probability is multiplied by a factor,
      // in order to compensate a reduction in translation due to how punctuation is dealt with.
      if (randomNumber < translationProbability * 3) {  
        sourceWords[word] = countedWords[word];
      }
    }     
  }
  return sourceWords;
}



function main(translationProbability, minimumSourceWordLength, userDefinedTranslations) {
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
  requestTranslations(filterSourceWords(countedWords, translationProbability, minimumSourceWordLength),
          function(tMap) {processTranslations(tMap, JSON.parse(userDefinedTranslations));}); 
}

chrome.extension.sendRequest({getOptions : "Give me the options chosen by the user..." }, function(r) {
  var blacklist = new RegExp(r.blacklist);
  if (r.activation == "true" && !blacklist.test(document.URL)) {
    insertCSS(r.translatedWordStyle);
    var f = "main(" + r.translationProbability + "," + r.minimumSourceWordLength + ",'" + r.userDefinedTranslations + "');"
    setTimeout(f, r.translationTimeout);
  }
});