/*
1. ngram deprecate
2. getAllWords optimize
3. replace toList with ES6 Array.from and destructing
4. remove injectCSS and injectScript
*/

export class ContentScriptCtrl {
  constructor() {
    var self = this;
    chrome.runtime.sendMessage({
      getOptions: 'Give me the options chosen by the user...'
    }, function(r) {
      console.log('Options: \n' + JSON.stringify(r));
      var blacklist = new RegExp(r.blacklist);
      if (!!r.activation && !blacklist.test(document.URL)) {
        var srcLang = r.sourceLanguage;
        var targetLang = r.targetLanguage;

        chrome.runtime.sendMessage({
          runMindTheWord: 'Execute!'
        }, () => {
          self.main(parseInt(r.ngramMin),
            parseInt(r.ngramMax),
            r.translationProbability,
            r.minimumSourceWordLength,
            JSON.parse(r.userDefinedTranslations),
            r.userBlacklistedWords,
            r.limitToUserDefined);
        });
      }
    });
  }
  main(ngramMin, ngramMax, translationProbability, minimumSourceWordLength, userDefinedTranslations, userBlacklistedWords, limitToUserDefined) {
    console.log('starting translation');
    var countedWords = this.getAllWords(ngramMin, ngramMax);
    console.log(countedWords);
    // var filteredWords;
    // if (limitToUserDefined) {
    //   filteredWords = this.filterSourceWordsLimitToUserDefined(countedWords, translationProbability, userDefinedTranslations);
    // } else {
    //   filteredWords = this.filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords);
    // }
    // this.requestTranslations(filteredWords,
    //   function(tMap) {
    //     this.processTranslations(tMap, userDefinedTranslations);
    //   });
  }
  getAllWords(ngramMin, ngramMax, self) {
    var countedWords = {};
    var paragraphs = document.getElementsByTagName('p');
    for (var i = 0; i < paragraphs.length; i++) {
      var words = paragraphs[i].innerText.split(/\s|,|[.()]|\d/g);
      for (var j = 0; j < words.length; j++) {
        for (var b = ngramMin; b <= ngramMax; b++) {
          var word = self.ngramAt(words, j, b);
          if (!(word in countedWords)) {
            countedWords[word] = 0;
          }
          countedWords[word] += 1;
        }
      }
    }
    return countedWords;
  }
  filterSourceWordsLimitToUserDefined(countedWords, translationProbability, userDefinedTranslations) {
    var userBlacklistedWords = new RegExp(userBlacklistedWords);
    var a = this.toList(userDefinedTranslations, function(word, count) {
      return 1;
    });
    var b = this.toList(countedWords, function(word, count) {
      return 1;
    });
    countedWordsList = this.intersect(a, b);

    var targetLength = Math.floor((this.length(countedWords) * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }
  filterSourceWords(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords) {
    userBlacklistedWords = new RegExp(userBlacklistedWords);

    var countedWordsList = shuffle(this.toList(countedWords, function(word, count) {
      return !!word && word.length >= minimumSourceWordLength && // no words that are too short
        word !== '' && !/\d/.test(word) && // no empty words
        word.charAt(0) != word.charAt(0).toUpperCase() && // no proper nouns
        !userBlacklistedWords.test(word.toLowerCase()); // no blacklisted words
    }));

    var targetLength = Math.floor((this.length(countedWords) * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }
  toMap(list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = 1;
    }
    return map;
  }
  toList(map, filter) {
    var list = [];
    for (var item in map) {
      if (filter(item, map[item])) {
        list.push(item);
      }
    }
    return list;
  }
  injectCSS(cssStyle) {
    try {
      document.styleSheets[0].insertRule('span.mtwTranslatedWord {' + cssStyle + '}', 0);
    } catch (e) {
      console.debug(e);
    }
  }
  injectScript(scriptURL) {
    var s = document.createElement('script');
    s.setAttribute('src', scriptURL);
    document.getElementsByTagName('head')[0].appendChild(s);
  }
  requestTranslations(sourceWords, callback) {
    console.log('requestTranslations');
    console.log('Source Words: ' + JSON.stringify(sourceWords));
    chrome.runtime.sendMessage({
      wordsToBeTranslated: sourceWords
    }, function(response) {
      callback(response.translationMap);
    });
  }
  deepHTMLReplacement(node, tMap, iTMap) {
    var badTags = ['TEXTAREA', 'INPUT', 'SCRIPT', 'CODE', 'A'];
    if (node.nodeType == Node.TEXT_NODE) {
      var newNodeValue = this.replaceAll(node.nodeValue, tMap);
      if (newNodeValue != node.nodeValue) {
        node.nodeValue = newNodeValue;
        var parent = node.parentNode;
        parent.innerHTML = this.replaceAll(parent.innerHTML, iTMap);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && (badTags.indexOf(node.tagName) <= -1)) {
      var innerNodes = node.childNodes;
      for (var index = 0; index < innerNodes.length - 1; index++) {
        this.deepHTMLReplacement(innerNodes[index], tMap, iTMap);
      }
    }
  }
  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
  // ToDo: This should be improved. The use of spaces is an ugly hack.
  // This ugly hack causes a decrease in the number of words that are translated.
  replaceAll(text, translationMap) {
    console.log('replaceAll');
    var rExp = '';
    // Sort the source words by length in descending order.
    // Longer source strings might contain shorter source strings.
    // It's important that the shorter strings are not replaced until the longer
    // strings have been replaced and this sorting ensures that is the case.
    var sortedSourceWords = Object.keys(translationMap)
      .sort(function sortDescending(w1, w2) {
        return w2.length - w1.length;
      });
    // Construct the rExp string based on the sorted source words.
    sortedSourceWords.forEach(function concatRExp(sourceWord) {
      rExp += '(\\s' + escapeRegExp(sourceWord) + '\\s)|';
    });
    rExp = rExp.substring(0, rExp.length - 1);
    console.log('rExp: ' + rExp);
    var regExp = new RegExp(rExp, 'gm');
    var newText = text.replace(regExp, function(m) {
      //if (translationMap[m] !== null) {
      if (translationMap[m.substring(1, m.length - 1)] !== null) {
        //return translationMap[m.substring(1, m.length - 1)] ;
        return ' ' + translationMap[m.substring(1, m.length - 1)] + ' ';
      } else {
        //return m;
        return ' ' + m + ' ';
      }
    });

    return newText;
  }
  invertMap(map) {
    var iMap = {};
    var swapJs = 'javascript:__mindtheword.toggleElement(this)';
    for (var e in map) {
      iMap[map[e]] = '<span data-sl="' + srcLang + '" data-tl="' + targetLang + '" data-query="' + e +
        '" data-original="' + e + '" data-translated="' + map[e] +
        '" class="mtwTranslatedWord" onClick="' + swapJs + '">' + map[e] + '</span>';
    }
    return iMap;
  }
  containsIllegalCharacters(s) {
    return /[0-9{}.,;:]/.test(s);
  }
  processTranslations(translationMap, userDefinedTMap) {

    var filteredTMap = {};
    for (var w in translationMap) {
      if (w != translationMap[w] && translationMap[w] !== '' && !userDefinedTMap[w] && !containsIllegalCharacters(translationMap[w])) {
        filteredTMap[w] = translationMap[w];
      }
    }

    for (w in userDefinedTMap) {
      if (w != userDefinedTMap[w]) {
        filteredTMap[w] = userDefinedTMap[w];
      }
    }

    if (this.length(filteredTMap) !== 0) {
      paragraphs = document.getElementsByTagName('p');
      for (var i = 0; i < paragraphs.length; i++) {
        this.deepHTMLReplacement(paragraphs[i], filteredTMap, invertMap(filteredTMap));
      }
    }
  }
  length(obj) {
    return Object.keys(obj).length;
  }
  intersect() {
    var i,
      all,
      shortest,
      nShortest,
      n,
      len,
      ret = [],
      obj = {},
      nOthers;
    nOthers = arguments.length - 1;
    nShortest = arguments[0].length;
    shortest = 0;
    for (i = 0; i <= nOthers; i++) {
      n = arguments[i].length;
      if (n < nShortest) {
        shortest = i;
        nShortest = n;
      }
    }
    for (i = 0; i <= nOthers; i++) {
      n = (i === shortest) ? 0 : (i || shortest); //Read the shortest array first. Read the first array instead of the shortest
      len = arguments[n].length;
      for (var j = 0; j < len; j++) {
        var elem = arguments[n][j];
        if (obj[elem] === i - 1) {
          if (i === nOthers) {
            ret.push(elem);
            obj[elem] = 0;
          } else {
            obj[elem] = i;
          }
        } else if (i === 0) {
          obj[elem] = 0;
        }
      }
    }
    return ret;
  }
  ngramAt(list, index, n) {
    return list.slice(index, index + n).join(' ');
  }
  __mindtheword() {
    this.translated = true;
    this.toggleAllElements = function() {
      console.log('toggleAllElements start');
      this.translated = !this.translated;
      var words = document.getElementsByClassName('mtwTranslatedWord');
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (isNaN(word.innerText)) { //isNaN returns true if parameter does NOT contain a number
          word.innerText = (this.translated) ? word.dataset.translated : word.dataset.original;
        }
      }
      console.log('toggleAllElements end');
    };
    this.isTranslated = function() {
      return this.translated;
    };
  };
}
