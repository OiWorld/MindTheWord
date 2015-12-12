// Copyright (c) 2011-2015 Bruno Woltzenlogel Paleo. All rights reserved.
// With a little help of these awesome guys, https://github.com/OiWorld/MindTheWord/graphs/contributors!

var srcLang, targetLang; // source language and target language

function injectCSS(cssStyle) {
    try {
        document.styleSheets[0].insertRule("span.mtwTranslatedWord {" + cssStyle + "}", 0);
    }
    catch(e) {
        console.debug(e);
    }
}

function injectScript(scriptURL) {
    var s = document.createElement("script");
    s.setAttribute("src", scriptURL);
    document.getElementsByTagName("head")[0].appendChild(s);
}

function requestTranslations(sourceWords, callback) {
    console.log("requestTranslations");
    console.log("Source Words: " + JSON.stringify(sourceWords) );
    chrome.runtime.sendMessage({wordsToBeTranslated: sourceWords}, function (response) {
        callback(response.translationMap);
    });
}

function deepHTMLReplacement(node, tMap, iTMap) {
    var badTags = ['TEXTAREA', 'INPUT', 'SCRIPT', 'CODE', 'A'];
    if (node.nodeType == Node.TEXT_NODE) {
        var newNodeValue = replaceAll(node.nodeValue, tMap);
        if (newNodeValue != node.nodeValue) {
            node.nodeValue = newNodeValue;
            var parent = node.parentNode;
            parent.innerHTML = replaceAll(parent.innerHTML, iTMap);
        }
    }
    else if (node.nodeType == Node.ELEMENT_NODE && !(badTags.indexOf(node.tagName) > -1)) {
        var child = node.firstChild;
        while (child) {
            deepHTMLReplacement(child, tMap, iTMap);
            child = child.nextSibling;
        }
    }
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// ToDo: This should be improved. The use of spaces is an ugly hack.
// This ugly hack causes a decrease in the number of words that are translated.
function replaceAll(text, translationMap) {
    console.log("replaceAll");
    var rExp = "";
    for (var sourceWord in translationMap) {
        //rExp += "(" + escapeRegExp(sourceWord) + ")|";
        rExp += "(\\s" + escapeRegExp(sourceWord) + "\\s)|";
    }
    rExp = rExp.substring(0, rExp.length - 1);
    console.log("rExp: " + rExp);
    var regExp = new RegExp(rExp, "gm");
    var newText = text.replace(regExp, function (m) {
        //if (translationMap[m] !== null) {
        if (translationMap[m.substring(1, m.length - 1)] !== null) {
            //return translationMap[m.substring(1, m.length - 1)] ;
            return " " + translationMap[m.substring(1, m.length - 1)] + " ";
        }
        else {
            //return m;
            return " " + m + " ";
        }
    });

    return newText;
}

function invertMap(map) {
    var iMap = {};
    var swapJs = "javascript:__mindtheword.toggleElement(this)";
    for (e in map) {
        iMap[map[e]] = '<span data-sl="' + srcLang + '" data-tl="' + targetLang + '" data-query="' + e +
            '" data-original="' + e + '" data-translated="' + map[e] +
            '" class="mtwTranslatedWord" onClick="' + swapJs + '">' + map[e] + '</span>';
    }
    return iMap;
}

function containsIllegalCharacters(s) {
    return /[0-9{}.,;:]/.test(s);
}

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
        paragraphs = document.getElementsByTagName('p');
        for (var i = 0; i < paragraphs.length; i++) {
            deepHTMLReplacement(paragraphs[i], filteredTMap, invertMap(filteredTMap));
        }
    }
}

function length(obj) {
    return Object.keys(obj).length;
}

function intersect() {
  var i, all, shortest, nShortest, n, len, ret = [], obj={}, nOthers;
  nOthers = arguments.length-1;
  nShortest = arguments[0].length;
  shortest = 0;
  for (i=0; i<=nOthers; i++){
    n = arguments[i].length;
    if (n<nShortest) {
      shortest = i;
      nShortest = n;
    }
  }
  for (i=0; i<=nOthers; i++) {
    n = (i===shortest)?0:(i||shortest); //Read the shortest array first. Read the first array instead of the shortest
    len = arguments[n].length;
    for (var j=0; j<len; j++) {
        var elem = arguments[n][j];
        if(obj[elem] === i-1) {
          if(i === nOthers) {
            ret.push(elem);
            obj[elem]=0;
          } else {
            obj[elem]=i;
          }
        }else if (i===0) {
          obj[elem]=0;
        }
    }
  }
  return ret;
}

function filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords) {
    var userBlacklistedWords = new RegExp(userBlacklistedWords);

    var countedWordsList = shuffle(toList(countedWords, function (word, count) {
        return !!word && word.length >= minimumSourceWordLength && // no words that are too short
            word != "" && !/\d/.test(word) && // no empty words
            word.charAt(0) != word.charAt(0).toUpperCase() && // no proper nouns
            !userBlacklistedWords.test(word.toLowerCase()); // no blacklisted words
    }));

    var targetLength = Math.floor((length(countedWords) * translationProbability) / 100);
    return toMap(countedWordsList.slice(0, targetLength - 1));
}

function filterSourceWordsLimitToUserDefined(countedWords, translationProbability, userDefinedTranslations) {
    var userBlacklistedWords = new RegExp(userBlacklistedWords);

    var a = toList(userDefinedTranslations, function(word,count) {return 1;});
    var b = toList(countedWords, function(word,count) {return 1;});
    countedWordsList = intersect(a,b);

    var targetLength = Math.floor((length(countedWords) * translationProbability) / 100);
    return toMap(countedWordsList.slice(0, targetLength - 1));
}

function toList(map, filter) {
    var list = [];
    for (var item in map) {
        if (filter(item, map[item])) {
            list.push(item);
        }
    }
    return list;
}

function toMap(list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = 1;
    }
    return map;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getAllWords(ngramMin, ngramMax) {
    console.log("getAllWords: ngramMin = " + ngramMin + "; ngramMax = " + ngramMax);
    var countedWords = {};
    paragraphs = document.getElementsByTagName('p');
    console.log("Getting words from all " + paragraphs.length + " paragraphs");
    for (var i = 0; i < paragraphs.length; i++) {
        var words = paragraphs[i].innerText.split(/\s|,|[.()]|\d/g);
        for (var j = 0; j < words.length; j++) {
            for (var b = ngramMin; b <= ngramMax; b++) {
                var word = ngramAt(words, j, b);
                if (!(word in countedWords)) {
                    countedWords[word] = 0;
                }
                countedWords[word] += 1;
            }
        }
    }
    return countedWords;
}

function ngramAt(list, index, n) {
    return list.slice(index, index + n).join(" ");
}

__mindtheword = new function () {
    this.translated = true;
    this.toggleAllElements = function () {
        this.translated = !this.translated;
        var words = document.getElementsByClassName('mtwTranslatedWord');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            word.innerHTML = (this.translated) ? word.dataset.translated : word.dataset.original;
        }
    };
    this.isTranslated = function () {
        return this.translated;
    };
};

function main(ngramMin, ngramMax, translationProbability, minimumSourceWordLength, userDefinedTranslations, userBlacklistedWords, limitToUserDefined) {
    console.log('starting translation');
    var countedWords = getAllWords(ngramMin, ngramMax);
    console.log(countedWords);
    var filteredWords;
    if (limitToUserDefined) {
        filteredWords = filterSourceWordsLimitToUserDefined(countedWords, translationProbability, userDefinedTranslations);
    } else {
        filteredWords = filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords);
    }
    requestTranslations(filteredWords,
        function (tMap) {
            processTranslations(tMap, userDefinedTranslations);
        });
}

console.log("mindTheWord running");
chrome.runtime.sendMessage({getOptions: "Give me the options chosen by the user..."}, function (r) {
    console.log("Options received: \n" +
        "  activation: " + r.activation + "\n" +
        "  ngramMin: " + r.ngramMin + "\n" +
        "  ngramMax: " + r.ngramMax);

    console.log("Options: \n" + JSON.stringify(r));

    var blacklist = new RegExp(r.blacklist);
    if (!!r.activation && !blacklist.test(document.URL)) {
        srcLang = r.sourceLanguage;
        targetLang = r.targetLanguage;
        injectScript(r.script);
        injectCSS(r.translatedWordStyle);

        chrome.runtime.sendMessage({runMindTheWord: "Execute!"}, function () {
            main(parseInt(r.ngramMin),
                parseInt(r.ngramMax),
                r.translationProbability + 24, // ToDo: I am increasing the probability here, to compensate for decreases caused elsewhere. This should be fixed.
                r.minimumSourceWordLength,
                JSON.parse(r.userDefinedTranslations),
                r.userBlacklistedWords,
                r.limitToUserDefined);
        })
    }
});
