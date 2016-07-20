import { YandexTranslate } from './services/yandexTranslate';
import { BingTranslate } from './services/bingTranslate';
import { GoogleTranslate } from './services/googleTranslate';

/** Class for content scriptcontroller */
export class ContentScript {
  /**
   * Initialize ContentScript object
   * @constructor
   */
  constructor() {
    this.srcLang = '';
    this.targetLang = '';
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.tMap = {};
    this.filteredTMap = {};
    this.selectedRegion = {};
    this.wordToggles = 0;
  }

  /**
   * Loads data from storage and calls appropriate
   * functions as per the settings.
   */
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
        this.wordToggles = res.wordToggles;
        this.autoBlacklist = res.autoBlacklist;
        var blacklistWebsiteReg = new RegExp(res.blacklist);

        if (blacklistWebsiteReg.test(document.URL) && res.blacklist !== '()') {
          console.log('[MTW] Blacklisted website');
        } else if (res.doNotTranslate === true) {
          console.log('[MTW] Do Not Translate selected.');
        } else if ((this.srcLang === '' || this.targetLanguage === '') && this.userDefinedOnly === false) {
          console.log('[MTW] No active pattern. Please select a pattern in the options page.');
        } else {
          this.injectCSS(res.translatedWordStyle);
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

  /**
   * Returns the current translator object.
   * @returns {Object} translatorObject corresponding to active translator
   */
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

  /**
   * Inject CSS file containing MTW styles into the page.
   * @param {string} cssStyle - stringified CSS style
   */
  injectCSS(cssStyle) {
    try {
      // insert MTW styles
      var style   = document.createElement('link');
      style.rel   = 'stylesheet';
      style.type  = 'text/css';
      style.href  = chrome.extension.getURL('/assets/css/MTWStyles.css');
      document.getElementsByTagName('head')[0].appendChild(style);

      // insert main mtwTranslatedWord stylesheet
      var mtwStyle = document.createElement('style');
      document.head.appendChild(mtwStyle);
      mtwStyle.sheet.insertRule('span.mtwTranslatedWord {' + cssStyle + '}', 0);

    } catch (e) {
      console.debug(e);
    }
  }

  /**
   * Retrieve all the words from current page
   * @param {number} ngramMin - minimum ngram for translation
   * @param {number} ngramMax - maximum ngram for translation
   * @returns {Object} countedWords - object with word counts
   */
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
        !(blackListReg.test(word.toLowerCase()) && blackListReg === '()') && // no blacklisted words
        !punctuationReg.test(word.toLowerCase()); // no punctuation marks
    }));
    var targetLength = Math.floor((Object.keys(countedWordsList).length * translationProbability) / 100);
    return this.toMap(countedWordsList.slice(0, targetLength - 1));
  }

  containsIllegalCharacters(s) {
    return /[0-9{}.,;:]/.test(s);
  }

  /**
   * Perform various functions on translations
   * @param {Object} translationMap - word wise translation object
   */
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

    //for quiz feature
    chrome.storage.local.set({'translatedWordsForQuiz': JSON.stringify(this.filteredTMap)});

    let numberOfTranslatedWords = Object.keys(filteredTMap).length;

    let numberOfTranslatedCharacters = 0;
    Object.keys(filteredTMap).forEach(function(e,i){
      numberOfTranslatedCharacters += e.length;
    });

    //total number of words translated
    this.stats['totalWordsTranslated'] += numberOfTranslatedWords;
    //number of words characters translated by each service in the current month
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let d = new Date();
    let currentMonth = month[d.getMonth()];

    // [0] => number of words, [1] => number of characters
    if (!(currentMonth in this.stats['translatorWiseWordCount'])){
      this.stats['translatorWiseWordCount'] = {};
      this.stats['translatorWiseWordCount'][currentMonth] = {
        'Yandex': [0,0],
        'Google':[0,0],
        'Bing':[0,0]
      };
    }
    this.stats['translatorWiseWordCount'][currentMonth][this.translator][0] += numberOfTranslatedWords;
    this.stats['translatorWiseWordCount'][currentMonth][this.translator][1] += numberOfTranslatedCharacters;
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

    // add event listener to each word for toggle
    var translatedWords = document.getElementsByClassName('mtwTranslatedWord');
    for (let i = 0; i < translatedWords.length; i++) {
      translatedWords[i].addEventListener('click', () => {
        this.toggleElement(event, this.wordToggles, this.autoBlacklist);
      }, false);
    }
  }

  /**
   * Event listener for each translation. Toggles translation
   * on clicking. Performs automatic blacklisting if enabled.
   * @param {Object} event - click event
   * @param {number}  wordToggles - word toggle threshold
   * @param {boolean} autoBlacklist - is automatic blacklisting turned on
   */
  toggleElement(event, wordToggles, autoBlacklist) {
    let target = event.target,
      word = target.innerHTML,
      original = target.dataset.original,
      newword = (word === target.dataset.translated) ? target.dataset.original : target.dataset.translated;
    if (autoBlacklist) {
      chrome.storage.local.get('toggleFrequency', (data) => {
        data = JSON.parse(data.toggleFrequency);
        if (original in data) {
          if (data[original] > wordToggles) {
            // add word to blacklist
            chrome.storage.local.get('userBlacklistedWords', (result) => {
              let blacklistedWords = result.userBlacklistedWords.slice(1, -1).split('|');
              if (blacklistedWords.indexOf(original) === -1) {
                blacklistedWords.push(original);
                chrome.storage.local.set({'userBlacklistedWords' : '(' + blacklistedWords.join('|') + ')'});
              }
            });
            delete data.original;
          } else {
            data[original] += 1;
          }
        } else if (Object.keys(data).length >= 100) {
          // delete lowest freq word
          let min = Infinity,
            lowest = '';
          for (let word in data) {
            if (data[word] < min) {
              min = data[word];
              lowest = word;
            }
          }
          delete data[lowest];
          data[original] = 1;
        } else {
          data[original] = 1;
        }
        chrome.storage.local.set({'toggleFrequency': JSON.stringify(data)});
      });
    }
    target.innerHTML = newword;
  }

  /**
   * Replaces source words with translated words
   * @param {Object} node - paragraph HTML node
   * @param {Object} tMap - translationMap
   * @param {Object} iTMap - HTML element for each translated word
   */
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

  /**
   * Returns text replaced with translations (if any)
   * otherwise returns the same text
   * @param {string} text - source text
   * @param {Object} translationMap - translations for source words
   * @returns {string} text - text with translations
   */
  replaceAll(text, translationMap) {
    var rExp = '';
    var sortedSourceWords = Object.keys(translationMap)
      .sort((w1, w2) => {
        return w2.length - w1.length;
      });
    sortedSourceWords.forEach((sourceWord) => {
      rExp += '(\\s' + this.escapeRegExp(sourceWord) + '\\s)|';
    });
    rExp = rExp.substring(0, rExp.length - 1);
    var regExp = new RegExp(rExp, 'gm');
    var newText = text.replace(regExp, (m) => {
      if (translationMap[m.substring(1, m.length - 1)] !== null) {
        return ' ' + translationMap[m.substring(1, m.length - 1)] + ' ';
      } else {
        return ' ' + m + ' ';
      }
    });
    if (/^\s*$/.test(newText)) {
      return text;
    }
    return newText;
  }

  /**
   * Forms HTML element for each translated word
   * @param {Object} map - translation map
   * @returns {Object} iMap - HTML node for each translation
   */
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
      } else {
        iMap[map[e]] = iMap[map[e]] + '" class="mtwTranslatedWord"';
      }
      iMap[map[e]] = iMap[map[e]] +
                    '>' + map[e] +
                    '</span>';
    }

    return iMap;
  }

  /**
   * Toggles all the translated words in the active page.
   * To be called from `popup.js`
   */
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

  /**
   * Remove special characters
   * @param {string} str - source string
   * @returns {string} str - escaped string
   */
  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  /**
   * Convert object to list
   * @param {Object} map - translation map
   * @param {function} filter
   */
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

  /**
   * Convert array to object
   * @param {Array} list
   * @returns {Object} map
   */
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
