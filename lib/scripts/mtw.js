import { YandexTranslate } from './services/yandexTranslate';
import { BingTranslate } from './services/bingTranslate';
import { GoogleTranslate } from './services/googleTranslate';

export class ContentScript {
  constructor() {
    this.srcLang = '';
    this.targetLang = '';
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.tMap = {};
    this.filteredTMap = {};
    this.selectedRegion = {};
  }

  translate() {
    chrome.storage.local.get(null, (res) => {
      if (res.activation === true) {
        this.ngramMin = res.ngramMin;
        this.ngramMax = res.ngramMax;
        this.srcLang = res.sourceLanguage;
        this.targetLanguage = res.targetLanguage;
        this.userDefinedTranslations = JSON.parse(res.userDefinedTranslations);
        this.translationProbability = res.translationProbability;
        this.userBlacklistedWords = res.userBlacklistedWords;
        this.translator = res.translatorService;
        this.yandexTranslatorApiKey = res.yandexTranslatorApiKey;
        this.bingTranslatorApiKey = res.bingTranslatorApiKey;
        this.googleTranslatorApiKey = res.googleTranslatorApiKey;
        this.translated = true;
        this.difficultyBuckets = res.difficultyBuckets;
        this.learntWords = res.learntWords;
        this.userDefinedOnly = res.userDefinedOnly;
        this.stats = JSON.parse(res.stats);
        var blacklistWebsiteReg = new RegExp(res.blacklist);

        if (blacklistWebsiteReg.test(document.URL)) {
          console.log('[MTW] Blacklisted website');
        } else if (res.doNotTranslate === true) {
          console.log('[MTW] Do Not Translate selected.');
        } else if ((this.srcLang === '' || this.targetLanguage === '') && this.userDefinedOnly === false) {
          console.log('[MTW] No active pattern. Please select a pattern in the options page.');
        } else {
          this.injectCSS(res.translatedWordStyle);
          this.injectJs(chrome.extension.getURL('/assets/js/MTWToggle.js'));
          var countedWords = this.getAllWords(this.ngramMin, this.ngramMax);
          var filteredWords;
          if (this.userDefinedOnly === true) {
            filteredWords = this.filterToUserDefined(countedWords,
              this.translationProbability,
              this.userDefinedTranslations,
              this.userBlacklistedWords);
            let tMap = {};
            for (let word in filteredWords) {
              tMap[word] = this.userDefinedTranslations[word];
            }
            this.processTranslations(tMap, this.userDefinedTranslations);
          } else {
            filteredWords = this.filter(countedWords,
              this.translationProbability,
              this.userDefinedTranslations,
              this.userBlacklistedWords);
              console.log(filteredWords);
            var translator = this.getTranslator();
            translator.getTranslations(filteredWords)
              .then((tMap) => {
                this.processTranslations(tMap, this.userDefinedTranslations);
              })
              .catch((e) => {
                console.error('[MTW]', e);
              });
          }
        }
      } else {
        console.log('[MTW] Switched off');
      }
    });
  }

  getTranslator() {
    let translatorObject = {};
    switch (this.translator) {
      case 'Yandex':
        translatorObject = new YandexTranslate(this.yandexTranslatorApiKey, this.srcLang, this.targetLanguage);
        break;
      case 'Bing':
        translatorObject = new BingTranslate(this.bingTranslatorApiKey, this.srcLang, this.targetLanguage);
        break;
      case 'Google':
        translatorObject = new GoogleTranslate(this.googleTranslatorApiKey, this.srcLang, this.targetLanguage);
        break;
      default:
        console.error('No such translator supported');
    }
    return translatorObject;
  }

  injectCSS(cssStyle) {
    try {
      var style   = document.createElement('link');
      style.rel   = 'stylesheet';
      style.type  = 'text/css';
      style.href  = chrome.extension.getURL('/assets/css/MTWStyles.css');
      document.getElementsByTagName('head')[0].appendChild(style);
    } catch (e) {
      console.debug(e);
    }
  }

  injectJs(scriptURL) {
    var s = document.createElement('script');
    s.setAttribute('src', scriptURL);
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  getAllWords(ngramMin, ngramMax) {
    var countedWords = {},
      paragraphs = document.getElementsByTagName('p');
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
    var a = this.toList(userDefinedTranslations, (word, count) => {
      return 1;
    });
    var b = this.toList(countedWords, (word, count) => {
      return 1;
    });
    var countedWordsList = this.intersect(a, b);
    return this.toMap(countedWordsList);
  }

  filter(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
    var blackListReg = new RegExp(userBlacklistedWords);
    var punctuationReg = new RegExp(/[\.,\/#\!\$%\^&\*;:{}=\\\_`~()\?@\d\+\-]/g);
    var countedWordsList = this.shuffle(this.toList(countedWords, (word, count) => {
      return !!word && word.length >= 2 && // no words that are too short
        word !== '' && !/\d/.test(word) && // no empty words
        word.charAt(0) !== word.charAt(0).toUpperCase() && // no proper nouns
        !blackListReg.test(word.toLowerCase()) && // no blacklisted words
        !punctuationReg.test(word.toLowerCase()); // no punctuation marks
    }));
    var targetLength = Math.floor((Object.keys(countedWordsList).length * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }

  containsIllegalCharacters(s) {
    return /[0-9{}.,;:]/.test(s);
  }

  processTranslations(translationMap, userDefinedTMap) {
    var filteredTMap = {};
    for (var w in translationMap) {
      if (w !== translationMap[w] && translationMap[w] !== '' && !userDefinedTMap[w] && !this.containsIllegalCharacters(translationMap[w])) {
        filteredTMap[w] = translationMap[w];
      }
    }

    for (w in userDefinedTMap) {
      if (w !== userDefinedTMap[w]) {
        filteredTMap[w] = userDefinedTMap[w];
      }
    }

    //filter out learnt words
    if (this.learntWords.length > 2) {
      let learntWordsReg = new RegExp(this.learntWords);
      Object.keys(filteredTMap).forEach(function(key) {
        if (learntWordsReg.test(filteredTMap[key].toLowerCase())){
          delete filteredTMap[key];
        }
      });
    }

    //for difficulty buckets feature
    this.filteredTMap = filteredTMap;

    //total number of words translated
    let numberOfTranslatedWords = Object.keys(filteredTMap).length;
    this.stats['totalWordsTranslated'] += numberOfTranslatedWords;
    chrome.storage.local.set({'stats': JSON.stringify(this.stats)});

    //number of words translated for active pattern
    chrome.storage.local.get(['savedPatterns'], function(result){
      var savedPatterns = JSON.parse(result.savedPatterns);
      for (var i = 0; i < savedPatterns.length; i++) {
        if(savedPatterns[i][3]){
          savedPatterns[i][5] += numberOfTranslatedWords;
          chrome.storage.local.set({'savedPatterns': JSON.stringify(savedPatterns)});
          break;
        }
      }
    });

    if (Object.keys(filteredTMap).length !== 0) {
      var paragraphs = document.getElementsByTagName('p');
      for (var i = 0; i < paragraphs.length; i++) {
        this.deepHTMLReplacement(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
      }
    }
  };

  deepHTMLReplacement(node, tMap, iTMap) {
    var badTags = ['TEXTAREA', 'INPUT', 'SCRIPT', 'CODE', 'A', 'SPAN'];
    if (node.nodeType === Node.TEXT_NODE) {
      var newNodeValue = this.replaceAll(node.nodeValue, tMap);
      if (newNodeValue !== node.nodeValue) {
        node.nodeValue = newNodeValue;
        var parent = node.parentNode;
        parent.innerHTML = this.replaceAll(parent.innerHTML, iTMap);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && badTags.indexOf(node.tagName) <= -1) {
      var innerNodes = node.childNodes;
      for (var index = 0; index < innerNodes.length - 1; index++) {
        this.deepHTMLReplacement(innerNodes[index], tMap, iTMap);
      }
    }
  }

  replaceAll(text, translationMap) {
    var rExp = '';
    var sortedSourceWords = Object.keys(translationMap)
      .sort(function sortDescending(w1, w2) {
        return w2.length - w1.length;
      });
    sortedSourceWords.forEach((sourceWord) => {
      rExp += '(\\s' + this.escapeRegExp(sourceWord) + '\\s)|';
    });
    rExp = rExp.substring(0, rExp.length - 1);
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
    var parsedDifficultyBuckets = JSON.parse(this.difficultyBuckets);
    var iMap = {};
    var swapJs = 'toggleElement(this)';
    for (var e in map) {
      iMap[map[e]] = '<span data-sl="' + this.srcLang +
                        '" data-tl="' + this.targetLanguage +
                        '" data-query="' + e +
                        '" data-original="' + e +
                        '" data-translated="' + map[e];

      if(map[e] in parsedDifficultyBuckets) {
        var wordDifficultyLevel = parsedDifficultyBuckets[map[e]];
        iMap[map[e]] = iMap[map[e]] + '" class="mtwTranslatedWord' + wordDifficultyLevel + '"';
      }
      else {
        iMap[map[e]] = iMap[map[e]] + '" class="mtwTranslatedWord"';
      }
      iMap[map[e]] = iMap[map[e]] + 'onClick="' + swapJs +
                        '">' + map[e] +
                        '</span>';
    }

    return iMap;
  }

  toggleAllElements() {
    this.translated = !this.translated;
    var words = document.getElementsByClassName('mtwTranslatedWord');
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (isNaN(word.innerText)) { //isNaN returns true if parameter does NOT contain a number
        word.innerText = (this.translated) ? word.dataset.translated : word.dataset.original;
      }
    }
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

var MTWTranslator = new ContentScript();
MTWTranslator.translate();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'toggleAllElements') {
    MTWTranslator.toggleAllElements();
  } else if (request.type === 'getTranslatedWords') {
    if (request.action === 'storeSelection') {
      MTWTranslator.selectedRegion = window.getSelection().getRangeAt(0);
    }
    sendResponse({translatedWords: MTWTranslator.filteredTMap});
  } else if (request.type = 'showTranslatedSentence') {
    let anchor = document.createElement('span');
    let dummy = document.createElement('span');
    dummy.innerText = request.data;
    dummy.classList.add('popover');
    dummy.classList.add('noselect');
    anchor.appendChild(dummy);
    anchor.classList.add('anchor');
    MTWTranslator.selectedRegion.insertNode(anchor);

    function handler(e) {
      this.removeEventListener('click', handler);
      anchor.parentNode.removeChild(anchor);
    }
    window.addEventListener('click', handler);
  }
});
