import { FreeTranslate } from './services/freeTranslate';
import { YandexTranslate } from './services/yandexTranslate';
import { BingTranslate } from './services/bingTranslate';
import { GoogleTranslate } from './services/googleTranslate';
import { getCurrentMonth,getCurrentDay } from './utils/dateAndTimeHelpers';
import { yandexLanguages } from './utils/languages.js';
import { bingLanguages } from './utils/languages.js';
import _ from 'lodash';


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
      window.localStorage.setItem('extensionID',res.extensionID);
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
        this.stats = res.stats;
        this.wordToggles = res.wordToggles;
        this.autoBlacklist = res.autoBlacklist;
        this.oneWordTranslation = res.oneWordTranslation;
        var blacklistWebsiteReg = new RegExp(res.blacklist);

        if (blacklistWebsiteReg.test(document.URL) && res.blacklist !== '()') {
          console.log('[MTW] Blacklisted website');
          chrome.runtime.sendMessage('message_off');
        } else if (res.doNotTranslate === true) {
          console.log('[MTW] Do Not Translate selected.');
          chrome.runtime.sendMessage('message_off');
        } else if ((this.srcLang === '' || this.targetLanguage === '') && this.userDefinedOnly === false) {
          console.log('[MTW] No active pattern. Please select a pattern in the options page.');
          chrome.runtime.sendMessage('message_off');
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
            testConnection(translator.url);
            translator.getTranslations(filteredWords)
              .then((tMap) => {
                this.processTranslations(tMap, this.userDefinedTranslations);
              })
              .catch((e) => {
                // this.sendError(e);
                console.error('[MTW]', e);
              });
          }
        }
      } else {
        console.log('[MTW] Switched off');
        chrome.runtime.sendMessage('message_off');
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
      case 'Free':
        translatorObject = new FreeTranslate(this.srcLang, this.targetLanguage);
        break;
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
      paragraphs = document.querySelectorAll('p,div,a');
    console.log('Getting words from all ' + paragraphs.length + ' paragraphs');
    for (var i = 0; i < paragraphs.length; i++) {
      var words = paragraphs[i].innerText;
      if(this.clkTest(words)){
        words = words.replace(/\d|\s|[()]/g,'').split('').filter(v=>v!='');
      }
      else{
        words = words.split(/\s|,|[.()]|\d/g);
      }
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
      if(this.clkTest(word))

        return !!word && word !== '' && !/\d/.test(word) && // no empty words
          !blackListReg.test(word.toLowerCase()) && // no blacklisted words
          !punctuationReg.test(word.toLowerCase()); // no punctuation marksreturn !!word && word.length >= 2 && // no words that are too short
      else
        return word !== '' && !/\d/.test(word) && // no empty words
          !blackListReg.test(word.toLowerCase()) && // no blacklisted words
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
    var currentMonth = getCurrentMonth();
    var currentDay = getCurrentDay();

    // [0] => number of words, [1] => number of characters
    if (!(currentMonth in this.stats['translatorWiseWordCount'][0])){
      this.stats['translatorWiseWordCount'][0] = {};
      this.stats['translatorWiseWordCount'][0][currentMonth] = {
        'Free': [0,0,0],
        'Yandex': [0,0,0],
        'Google':[0,0,0],
        'Bing':[0,0,0]
      };
    }

    if (!(currentDay in this.stats['translatorWiseWordCount'][1])){
      this.stats['translatorWiseWordCount'][1] = {};
      this.stats['translatorWiseWordCount'][1][currentDay] = {
        'Free': [0,0,0],
        'Yandex': [0,0,0],
        'Google':[0,0,0],
        'Bing':[0,0,0]
      };
    }

    if (!this.userDefinedOnly) {
      this.stats['translatorWiseWordCount'][0][currentMonth][this.translator][0] += numberOfTranslatedWords;
      this.stats['translatorWiseWordCount'][0][currentMonth][this.translator][1] += numberOfTranslatedCharacters;
      this.stats['translatorWiseWordCount'][0][currentMonth][this.translator][2] += numberOfTranslatedCharacters;
      this.stats['translatorWiseWordCount'][1][currentDay][this.translator][0] += numberOfTranslatedWords;
      this.stats['translatorWiseWordCount'][1][currentDay][this.translator][1] += numberOfTranslatedCharacters;
      this.stats['translatorWiseWordCount'][1][currentDay][this.translator][2] += numberOfTranslatedCharacters;
      chrome.storage.local.set({'stats': this.stats});
    }

    //number of words translated for active pattern
    chrome.storage.local.get(['savedPatterns'], function(result){
      var savedPatterns = JSON.parse(result.savedPatterns);
      for (var i = 0; i < savedPatterns.length; i++) {
        if(savedPatterns[i][3]){
          savedPatterns[i][5] += numberOfTranslatedWords;
          chrome.storage.local.set({'savedPatterns': JSON.stringify(savedPatterns)});
          chrome.storage.local.set({'numberOfTranslatedWords': JSON.stringify(numberOfTranslatedWords)});
          chrome.runtime.sendMessage('message_on');
          break;
        }
      }
    });
    if (Object.keys(filteredTMap).length !== 0) {
      var paragraphs = document.querySelectorAll('p,div,a');
      if (this.oneWordTranslation) {
        for (var i = 0; i < paragraphs.length; i++) {
          this.translateOneWord(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
        }
      } else {
        for (var i = 0; i < paragraphs.length; i++) {
          this.translateDeep(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
        }
      }
    }

     // console.log(filteredTMap);

    // Add event listener to each word for toggle
    var translatedWords = document.querySelectorAll('.mtwTranslatedWord, .mtwTranslatedWorde, .mtwTranslatedWordn, .mtwTranslatedWordh');
    for (let i = 0; i < translatedWords.length; i++) {
      var hoverHTML = '<p>' + translatedWords[i].getAttribute("data-original") + '</p>'; 
      $(translatedWords[i]).hovercard({
        detailsHTML: hoverHTML,
        width: 150
      });
    }
  }

  /**
   * Translate one word in each sentence for a  paragraph.
   * NOTE: The words are split by sentences and not by spaces
   * to prevent inconsistent reforming of paragraphs due to
   * rogue spaces.
   * @param {Object} paragraph - Paragraph nodeType
   * @param {Object} filteredTMap - filtered translation map
   * @param {Object} iMap - HTML element for each translated word
   */
  translateOneWord(paragraph, filteredTMap, iMap) {
    for (let i in paragraph.childNodes) {
      if (paragraph.childNodes[i].nodeType === 3) {
        if(!/^\s*$/.test(paragraph.childNodes[i].textContent)){
          if((this.srcLang == yandexLanguages.Chinese)||(this.srcLang == bingLanguages["Chinese Simplified"])||(this.srcLang == bingLanguages["Chinese Traditional"])||(this.srcLang == yandexLanguages.Japanese)){
            let sentences = paragraph.childNodes[i].textContent.split('。');
            for (let j in sentences) {
              let words = sentences[j].split("");
              words = _.shuffle(words);
              for (let k in words) {      // loop interrupted after one word is found
                if (filteredTMap[words[k]]) {
                  let x = sentences[j].replace(words[k], ' ' +  iMap[filteredTMap[words[k]]] + ' ');
                  sentences[j] = x;
                  break;
                }
              }
            }
            var newNode = document.createElement('span');
            newNode.innerHTML = sentences.join('。');
            paragraph.replaceChild(newNode, paragraph.childNodes[i]);
          }
          else{
            var sentences;
            if(this.srcLang == yandexLanguages.Hindi){
              sentences = paragraph.childNodes[i].textContent.split('।');
            }
            else if(this.srcLang == yandexLanguages.Armenian){
              sentences = paragraph.childNodes[i].textContent.split(':');
            }
            else{
              sentences = paragraph.childNodes[i].textContent.split('.');
            }
            for (let j in sentences) {
              let words = sentences[j].split(' ');
              var shuffleIndices = _.shuffle(Array.apply(null, {length: words.length}).map(Function.call, Number));
              for (let k in words) {      // loop interrupted after one word is found
                if (filteredTMap[words[shuffleIndices[k]]]) {
                  words[shuffleIndices[k]] = iMap[filteredTMap[words[shuffleIndices[k]]]];
                  break;
                }
              }
              sentences[j] = words.join(" ");
            }
            var newNode = document.createElement('span');
            if(this.srcLang == yandexLanguages.Hindi){
              newNode.innerHTML = sentences.join('।');
            }
            else if(this.srcLang == yandexLanguages.Armenian){
              newNode.innerHTML = sentences.join(':');
            }
            else{
              newNode.innerHTML = sentences.join('.');
            }
            paragraph.replaceChild(newNode, paragraph.childNodes[i]);
          }
        }
      }
    }
  }

  /**
   * Replaces source words with translated words
   * @param {Object} node - paragraph HTML node
   * @param {Object} tMap - translationMap
   * @param {Object} iTMap - HTML element for each translated word
   */
  translateDeep(paragraph, filteredTMap, iMap) {
    for (let i in paragraph.childNodes) {
      if (paragraph.childNodes[i].nodeType === 3) {
        if(!/^\s*$/.test(paragraph.childNodes[i].textContent)){
          if((this.srcLang == yandexLanguages.Chinese)||(this.srcLang == bingLanguages["Chinese Simplified"])||(this.srcLang == bingLanguages["Chinese Traditional"])||(this.srcLang == yandexLanguages.Japanese)){
          	let words = paragraph.childNodes[i].textContent.split("");
            let toBeTranslated = Math.floor(words.length * this.translationProbability/100);
            let actualCount = 0;
            for (let k in words) {      // loop interrupted after one wordlimit is crossed
              if (filteredTMap[words[k]]) {
                words[k] = ' ' + iMap[filteredTMap[words[k]]] + ' ';
                actualCount += 1;
              }
              if(actualCount >= toBeTranslated){
                break;
              }
            }
            var newNode = document.createElement('span');
            newNode.innerHTML = words.join(' ');
            paragraph.replaceChild(newNode, paragraph.childNodes[i]);
          }
          else{
            let words = paragraph.childNodes[i].textContent.split(' ');
            let toBeTranslated = Math.floor(words.length * this.translationProbability/100);
            let actualCount = 0;
            for (let k in words) {      // loop interrupted after one wordlimit is crossed
              if (filteredTMap[words[k]]) {
                words[k] = iMap[filteredTMap[words[k]]];
                actualCount += 1;
              }
              if(actualCount >= toBeTranslated){
                break;
              }
            }
            var newNode = document.createElement('span');
            newNode.innerHTML = words.join(' ');
            paragraph.replaceChild(newNode, paragraph.childNodes[i]);
          }
        }
      }
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
    var words = document.querySelectorAll('.mtwTranslatedWord, .mtwTranslatedWorde, .mtwTranslatedWordn, .mtwTranslatedWordh');
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


  sendError(message) {
    if(message == '')
      message = 'Could not connect to '+this.translator+' Service .\nIt may be temporarily unavailable  or you may be experiencing  internet connection problems ';

    var date = new Date();
    
    var data = {
          message:message,
          date:date.toLocaleDateString(),
          time:date.toLocaleTimeString(),
          url:window.location.href
    }

    chrome.runtime.sendMessage(data, function(response) {
      if (Notification.permission !== "granted"){
            Notification.requestPermission(function (permission) {
              // If the user accepts, resend notification
              if (permission === "granted") {
                notify(message,'/views/options.html');
              }
          });
      }
       
      notify(message,'/views/options.html');
      
    });
  }


  clkTest(str){
    var clk_main = new RegExp("[\u4E00-\u9FFF]"); 
    var clk_extension = new RegExp("[\u3400-\u4DBF]"); 
    var clk_strokes = new RegExp("[\u31C0-\u31EF]"); 
    var clk_symbols_punctuation = new RegExp("[\u3000-\u303F]");
    return (clk_main.test(str)||clk_extension.test(str)||clk_strokes.test(str)||clk_symbols_punctuation.test(str));
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

function notify(message,url) {

  var extensionID = window.localStorage.getItem('extensionID');
  var baseUrl = "chrome-extension://"+extensionID;

  var notification = new Notification('Mind The Word', {
    icon: baseUrl + '/assets/img/48.png',
    body: message,
  });

  notification.onclick = function () {
    window.open(url);      
    this.close();
  };

  setTimeout(function () {
    notification.close();
  },10000);
}


var attempts = 1;
var time;
var timer;


/**
 * Generate the time interval 
 */
function generateInteval () {
  return (Math.pow(2, attempts) - 1) * 1000;
}


/**
 * Test the connection
 * @param {url} string - url of the translator service to connect to
 */
function testConnection(url) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {

          if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.statusText != '' || xhr.status == 200){
              connection('success',url);
              return;
            } else{
              time = generateInteval(attempts);
              attempts++;
              reset = true;
              connection('fail',url,time);              
              return;
            }
          }
  };

  xhr.open("GET", url);
  xhr.send();
}

/**
 * Handle the connection status
 * @param {status} string - status of connection
 * @param {url} string - url of the translator service to connect to
 * @param {time} string - time interval for next connection
 */
function connection(status,url='',time='') {

  var tempTime = parseInt(time/1000);
  var mtwReconnectTime = document.getElementById('mtw-reconnect-time');
  var mtwConnectionHead = document.getElementById('mtw-connection-head');
  var mtwReconnect = document.getElementById('mtw-reconnect-now');

  if(status=='success'){
    if(mtwConnectionHead){
      mtwConnectionHead.parentNode.removeChild(mtwConnectionHead);
    }
  }else if(mtwConnectionHead){
    clearInterval(timer);
    if(status=='fail'){

      timer = setInterval(function () {
        if(tempTime==0){
          mtwReconnectTime.innerHTML = 'Connecting';
          mtwReconnect.style.display = 'none';
          testConnection(url); 
          clearInterval(timer);
          return;
        }
        mtwReconnectTime.innerHTML = 'Could not connect to Translator Service Reconnecting in '+tempTime +'s  &nbsp;....&nbsp;';
        mtwReconnect.style.display = 'inline';
        tempTime--;
      },1000);
    }
    else{
      mtwReconnectTime.innerHTML = 'Connection Successful';
        mtwReconnect.style.display = 'none';
        mtwConnectionHead.style.background = 'green';

        setTimeout(function(){
          mtwConnectionHead.parentNode.removeChild(mtwConnectionHead);
        },500);
    }
  }else{
    mtwConnectionHead = document.createElement('div');
    var styleConnectionHead = 'position: fixed; top:0;width: 100%; display: flex; justify-content: center; align-items: center; background: red; padding: 0.5em 0; color: white !important; font-size: 0.9em; z-index: 1000;';
    mtwConnectionHead.setAttribute('id','mtw-connection-head');
    mtwConnectionHead.setAttribute('style',styleConnectionHead);
    mtwConnectionHead.innerHTML='<div><strong>MTW:</strong>  <span id="mtw-reconnect-time">Could not connect to Translator Service Reconnecting in '+tempTime +'s  &nbsp;....&nbsp;</span><span id="mtw-reconnect-now"  style="cursor:pointer;"><strong>Reconnect Now</strong></span> </div> <span id="mtw-connection-cross" style="position: absolute; right: 1em; font-size: 1.2em;cursor:pointer;">✕</span> </div>';
    if(status=='fail')
      document.querySelector('body').appendChild(mtwConnectionHead);


    mtwReconnectTime = document.getElementById('mtw-reconnect-time');
    mtwReconnect = document.getElementById('mtw-reconnect-now');
    mtwConnectCross = document.getElementById('mtw-connection-cross');

    try{
      mtwReconnect.addEventListener('click',function () {
      attempts = 1;
      mtwReconnectTime.innerHTML = 'Connecting';
      mtwReconnect.style.display = 'none';
        testConnection(url);
      });

      mtwConnectCross.addEventListener('click',function(){
        attempts = 1;
        mtwConnectionHead.parentNode.removeChild(mtwConnectionHead);
      });
    }catch(e){
      console.log(e);
    }
    testConnection(url); 
  }
}
