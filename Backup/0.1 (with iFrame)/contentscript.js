/*
 * Copyright (c) 2011 Bruno Woltzenlogel Paleo. All rights reserved.
 */

alert("hello");

//function replaceAllOccurrences(sourceWord, targetWord) {
//  var regExp = new RegExp(" " + sourceWord + " ","gm")
//  var newInnerHTML = document.body.innerHTML.replace(regExp,' <span title="'+ sourceWord +'">' + targetWord + '</span> ')
//  document.body.innerHTML = newInnerHTML
//}


// To increase efficiency, I could do all replacements in a single pass:
//var rx= /(,)|(win| *)/g,
//str = str.replace(rx, function(m){
//	return m== ','? '.': '';
//});




function requestTranslation(sourceWord, callback) {
  chrome.extension.sendRequest({wordToBeTranslated : sourceWord }, function(response) {
    callback(sourceWord, response.translatedWord)
  });
}

var translationProbability = 10
chrome.extension.sendRequest({translationProbability : "Give me the translation probability chosen by the user in the options page..." }, function(response) {
  translationProbability = response.translationProbability
});


function deepText(node, f){
  if (node.nodeType == 3) {
    node.nodeValue = f(node.nodeValue)
  }
  else {
    var child = node.firstChild;
    while (child){
        deepText(child,f);
        child = child.nextSibling;
    }
  }
}

function replaceAll(text, sourceWord, targetWord) {
  var regExp = new RegExp(" " + sourceWord + " ","gm")
  var newText = text.replace(regExp, " " + targetWord + " ")
  return newText
}

function translationContinuation(s, t) { 
  deepText(document.body, function(text){
    return replaceAll(text, s, t)
  })
//  alert("hey")
//  var newInnerHTML = replaceAll(document.body.innerHTML, " " + t + " ", ' <span title="'+ s +'">' + t + '</span> ')
//  alert("oi")
//  document.body.innerHTML = newInnerHTML
}

var words = document.body.innerText.split(/\s/g)
var wordsArray = {}
for (index in words) {
  if (wordsArray[words[index]]) {
    wordsArray[words[index]] += 1
  }
  else {
    wordsArray[words[index]] = 1
  }
}

for (word in wordsArray) {
  var randomNumber=Math.floor(Math.random()*100)
  if (randomNumber < translationProbability) {
    requestTranslation(word,translationContinuation)  
  }
}


