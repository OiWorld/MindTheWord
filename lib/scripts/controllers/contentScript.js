/*
1. ngram deprecate
2. getAllWords optimize
3. replace toList with ES6 Array.from and destructing
4. remove injectCSS and injectScript
5. optimize intersect
6. modularize utils
7. Better Cleaning of source words
8. to List edit
*/

export class ContentScriptCtrl {
  constructor() {
    this.srcLang = '';
    this.targetLang = '';
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.translate();
  }

  translate() {
    chrome.runtime.sendMessage({
      getOptions: '1'
    }, (res) => {
      console.log('options:', res);
      if (res.activation === true) {
        this.ngramMin = res.ngramMin;
        this.ngramMax = res.ngramMax;
        this.srcLang = res.sourceLanguage;
        this.targetLanguage = res.targetLanguage;
        this.userDefinedTranslations = res.userDefinedTranslations;
        this.translationProbability = res.translationProbability;
        this.userBlacklistedWords = res.userBlacklistedWords;

        var countedWords = this.getAllWords(this.ngramMin, this.ngramMax);
        console.log(countedWords, Object.keys(countedWords).length);
        // var filteredWords = this.userDefinedTranslations ?
        //   this.filterToUserDefined(countedWords, this.translationProbability, this.userDefinedTranslations) :
        // this.filter(countedWords, this.translationProbability, this.userDefinedTranslations, this.userBlacklistedWords);
        var filteredWords = this.filter(countedWords,
          this.translationProbability,
          this.userDefinedTranslations,
          this.userBlacklistedWords);
        console.log(filteredWords);
        this.requestTranslations(filteredWords,
          (tMap) => {
            this.processTranslations(tMap, this.userDefinedTranslations);
          });
      } else {
        console.log('switched off');
      }
    });
  }

  getAllWords(ngramMin, ngramMax) {
    console.log('getAllWords: ngramMin = ' + ngramMin + '; ngramMax = ' + ngramMax);
    var countedWords = {};
    var paragraphs = document.getElementsByTagName('p');
    console.log('Getting words from all ' + paragraphs.length + ' paragraphs');
    for (var i = 0; i < paragraphs.length; i++) {
      var words = paragraphs[i].innerText.split(/\s|,|[.()]|\d/g);
      for (var j = 0; j < words.length; j++) {
        for (var b = ngramMin; b <= ngramMax; b++) {
          var word = words.slice(j, j + b).join(' ');
          if (!(word in countedWords)) {
            countedWords[word] = 0;
          }
          countedWords[word] += 1;
        }
      }
    }
    return countedWords;
  }

  filterToUserDefined(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
    var blackListReg = new RegExp(userBlacklistedWords);
    var a = Array.from(userDefinedTranslations);
    var b = Array.from(countedWords);
    var countedWordsList = this.intersect(a, b);
    var targetLength = Math.floor((Object.keys(countedWords).length * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }

  filter(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
    var blackListReg = new RegExp(userBlacklistedWords);
    var countedWordsList = this.shuffle(this.toList(countedWords, function(word, count) {
      return !!word && word.length >= 2 && // no words that are too short
        word !== '' && !/\d/.test(word) && // no empty words
        word.charAt(0) != word.charAt(0).toUpperCase() && // no proper nouns
        !blackListReg.test(word.toLowerCase()); // no blacklisted words
    }));
    var targetLength = Math.floor((Object.keys(countedWords).length * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }

  requestTranslations(sourceWords, callback) {
    console.log('requestTranslations');
    console.log('Source Words: ', sourceWords);
    chrome.runtime.sendMessage({
      wordsToBeTranslated: sourceWords
    }, function(response) {
      callback(response.translationMap);
    });
  }

  containsIllegalCharacters(s) {
    return /[0-9{}.,;:]/.test(s);
  }

  processTranslations(translationMap, userDefinedTMap) {
    var filteredTMap = {};
    for (var w in translationMap) {
      if (w != translationMap[w] && translationMap[w] !== '' && !userDefinedTMap[w] && !this.containsIllegalCharacters(translationMap[w])) {
        filteredTMap[w] = translationMap[w];
      }
    }

    for (w in userDefinedTMap) {
      if (w != userDefinedTMap[w]) {
        filteredTMap[w] = userDefinedTMap[w];
      }
    }

    if (Object.keys(filteredTMap).length !== 0) {
      var paragraphs = document.getElementsByTagName('p');
      for (var i = 0; i < paragraphs.length; i++) {
        this.deepHTMLReplacement(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
      }
    }
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

  replaceAll(text, translationMap) {
    console.log('replaceAll');
    var rExp = '';
    var sortedSourceWords = Object.keys(translationMap)
      .sort(function sortDescending(w1, w2) {
        return w2.length - w1.length;
      });
    // Construct the rExp string based on the sorted source words.
    sortedSourceWords.forEach((sourceWord) => {
      rExp += '(\\s' + this.escapeRegExp(sourceWord) + '\\s)|';
    });
    rExp = rExp.substring(0, rExp.length - 1);
    console.log('rExp: ' + rExp);
    var regExp = new RegExp(rExp, 'gm');
    var newText = text.replace(regExp, function(m) {
      if (translationMap[m.substring(1, m.length - 1)] !== null) {
        return ' ' + translationMap[m.substring(1, m.length - 1)] + ' ';
      } else {
        return ' ' + m + ' ';
      }
    });

    return newText;
  }

  invertMap(map) {
    var iMap = {};
    var swapJs = this.toggleAllElements(this);
    for (var e in map) {
      iMap[map[e]] = '<span data-sl="' + this.srcLang + '" data-tl="' + this.targetLang + '" data-query="' + e +
        '" data-original="' + e + '" data-translated="' + map[e] +
        '" class="mtwTranslatedWord" onClick="' + swapJs + '">' + map[e] + '</span>';
    }
    return iMap;
  }

  toggleAllElements() {
    console.log('toggleAllElements start');
    // this.translated = !this.translated;
    var words = document.getElementsByClassName('mtwTranslatedWord');
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (isNaN(word.innerText)) { //isNaN returns true if parameter does NOT contain a number
        word.innerText = (this.translated) ? word.dataset.translated : word.dataset.original;
      }
    }
    console.log('toggleAllElements end');
  }

  /**********************utils*******************************/

  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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

  shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  toMap(list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = 1;
    }
    return map;
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

}
