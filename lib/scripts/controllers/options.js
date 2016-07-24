import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';
import bootstrapcolorpicker from '../../assets/js/bootstrap-colorpicker.min.js';
import { startFrom } from '../filters/startFrom';
import * as lang from '../utils/languages';
import { localData } from '../utils/defaultStorage';
import { saveFile } from '../utils/saveFile';

/** Class for option page angular controller */
export class OptionCtrl {
  /**
   * Initialize options page data and jQuery
   * @constructor
   * @param {Object} $scope - Angular scope
   * @param {Object} $timeout - Angular timeout
   */
  constructor($scope, $timeout) {
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.patterns = {};
    this.key = '';
    this.blacklistedWords = [];
    this.learntWords = [];
    this.learntWordPage = 0;
    this.blacklistedWebsites = [];
    this.blacklistWordPage = 0;
    this.difficultyBucketsWordPage = 0;
    this.blacklistWebsitePage = 0;
    this.translator = '';
    this.userDefinedTranslationList = [];
    this.userDefinedTranslations = {};
    this.userDefinedTranslationPage = 0;
    this.yandexTranslatorApiKey = '';
    this.googleTranslatorApiKey = '';
    this.bingTranslatorApiKey = '';
    this.minWordLength = 3;
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.cssOptions = [];
    this.percentage = '15';
    this.original = '';
    this.translated = '';
    this.newBlacklistWord = '';
    this.newlearntWord = '';
    this.newBlacklistWebsite = '';
    this.voiceName = 'Google US English';
    this.pitch = 1.0;
    this.volume = 0.5;
    this.rate = 1.0;
    this.languages = {};
    this.bingClientId = '';
    this.difficultyBuckets = JSON.parse('{}');
    this.difficultyBucketsWords = [];
    this.newDifficultyBucketWord = '';
    this.newDifficultyBucketWordLevel = '';
    this.savedTranslations = {};
    this.savedTranslationList = [];
    this.savedTranslationPage = 0;
    this.userDefinedOnly = false;
    this.doNotTranslate = false;
    this.stats = {};
    this.activationToggles = 0;
    this.wordToggles = 0;
    this.translatedWordsForQuiz = {};
    this.quizAnswers = [];
    this.pageReload = function(){window.location.reload(true);};
    this.keyAlert = false;
    this.getData();
    this.setup();
  }

  getData() {
    chrome.storage.local.get(null, (data) => {
      console.log(data);
      this.patterns = JSON.parse(data.savedPatterns);
      this.key = data.yandexTranslatorApiKey;

      this.blacklistedWords = data.userBlacklistedWords.slice(1, -1).split('|').filter(function(n){ return n !== ''; });
      this.blacklistedWebsites = data.blacklist.slice(1, -1).split('|').filter(function(n){ return n !== ''; });

      this.translatorService = data.translatorService;
      this.userDefinedTranslations = JSON.parse(data.userDefinedTranslations);
      this.userDefinedTranslationList = this.toList(this.userDefinedTranslations);
      this.yandexTranslatorApiKey = data.yandexTranslatorApiKey;
      this.googleTranslatorApiKey = data.googleTranslatorApiKey;
      this.bingTranslatorApiKey = data.bingTranslatorApiKey;
      this.minWordLength = data.minimumSourceWordLength;
      this.ngramMin = data.ngramMin;
      this.ngramMax = data.ngramMax;
      this.cssOptions = data.translatedWordStyle.split(';');
      this.translatedWordStyle = data.translatedWordStyle;
      let playbackOptions = JSON.parse(data.playbackOptions);
      this.voiceName = playbackOptions.voiceName;
      this.pitch = playbackOptions.pitch;
      this.volume = playbackOptions.volume;
      this.rate = playbackOptions.rate;
      this.learntWords = data.learntWords.slice(1, -1).split('|');
      //remove empty strings from the array in case learntWords is empty
      this.learntWords = this.learntWords.filter(function(n){ return n !== ''; });
      this.difficultyBuckets = JSON.parse(data.difficultyBuckets);
      this.difficultyBucketsWords = Object.keys(this.difficultyBuckets);
      this.savedTranslations = JSON.parse(data.savedTranslations);
      this.savedTranslationList = this.toList(this.savedTranslations);
      this.userDefinedOnly = data.userDefinedOnly;
      this.doNotTranslate = data.doNotTranslate;
      this.stats = JSON.parse(data.stats);
      this.activationToggles = data.activationToggles;
      this.wordToggles = data.wordToggles;
      this.autoBlacklist = data.autoBlacklist;
      this.translatedWordsForQuiz = JSON.parse(data.translatedWordsForQuiz);
      //randomly selected 10 words for the quiz
      this.randomTranslatedWordsForQuiz = this.randomlySelectTenWords(this.translatedWordsForQuiz);
      this.translatedWordsExist = Object.keys(this.randomTranslatedWordsForQuiz).length === 0 ? false : true;
      this.setKeyAlert();
      this.intializeStyleOptions();
      this.$timeout(() => {
        this.$scope.$apply();
      });
    });
  }

  setup() {
    $('#text-colorpicker').colorpicker().on('changeColor', (data) => {
      this.setTextColor(data);
    });
    $('#bg-colorpicker').colorpicker().on('changeColor', (data) => {
      this.setBackgroundColor(data);
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  status(text, duration, fade, type) {
    (function(text, duration, fade) {
      var status = document.createElement('div');
      status.className = 'alert alert-' + type;
      status.innerText = text;
      document.getElementById('status').appendChild(status);

      setTimeout(() => {
        var opacity = 1,
          ntrvl = setInterval(() => {
            if (opacity <= 0.01) {
              clearInterval(ntrvl);
              document.getElementById('status').removeChild(status);
            }
            status.style.opacity = opacity;
            opacity -= (1 / fade);
          }, 1);
      }, (duration - fade));
    })(text, duration, fade);
  }

  save(data, successMessage) {
    chrome.storage.local.set(data, (error) => {
      if (error) {
        this.status('Error Occurred. Please refresh.', 1000, 100, 'danger');
      } else {
        this.status(successMessage, 1000, 100, 'success');
      }
    });
  }

  range(number) {
    return new Array(Math.ceil(number/4));
  }

  hashRange(hash) {
    return new Array(Math.ceil((Object.keys(hash).length)/4));
  }

  randomlySelectTenWords(translatedWords){
    var keys = Object.keys(translatedWords);
    this.translatedWordsExist = keys.length === 0 ? false : true;
    var result = {};
    for (var i=0; i<10; i++) {
      let randomKey = keys[Math.round(Math.random() * (keys.length - 0) + 0)];
      if(typeof randomKey !== 'undefined'){
        result[randomKey] = translatedWords[randomKey];
      }
      let index = keys.indexOf(randomKey);
      if (index > -1) {
        keys.splice(index, 1);
      }
    }
    return result;
  }

  /*****************************PATTERN FUNCTIONS*****************************/

  activatePattern(index) {
    if (this.hasKey(this.patterns[index][4])) {
      this.status('You do not have a key to for the translator', 2000, 100, 'danger');
    } else {
      this.deactivatePatterns();
      this.patterns[index][3] = true;
      this.userDefinedOnly = false;
      this.doNotTranslate = false;
      this.translatorService = this.patterns[index][4];
      this.save({
        translatorService: this.patterns[index][4],
        translationProbability: this.patterns[index][2],
        sourceLanguage: this.patterns[index][0][0],
        targetLanguage: this.patterns[index][1][0],
        savedPatterns: JSON.stringify(this.patterns),
        userDefinedOnly: false,
        doNotTranslate: false
      }, 'Activated Pattern');
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  createPattern() {
    if (this.srcLang === undefined || this.targetLang === undefined){
      this.status('Please select a valid language', 1000, 100, 'danger');
    } else {
      var patterns = this.patterns,
        src = [],
        trg = [],
        prb,
        duplicateInput = false, //to check duplicate patterns
        translator = this.translator;

      src[0] = document.getElementById('srcLang');
      src[1] = this.srcLang;
      src[2] = src[0].children[src[0].selectedIndex].text;
      trg[0] = document.getElementById('targetLang');
      trg[1] = this.targetLang;
      trg[2] = trg[0].children[trg[0].selectedIndex].text;
      prb = this.percentage;

      for (var index in patterns) {
        if (patterns[index][0][0] === src[1] && patterns[index][1][0] === trg[1] && patterns[index][2] === prb && patterns[index][4] === translator) {
          duplicateInput = true;
          status('Pattern already exists', 1000, 100, 'error');
        }
      }
      if (duplicateInput === false) {
        this.patterns.push([
          [src[1], src[2]],
          [trg[1], trg[2]],
          prb,
          false,
          translator,
          0
        ]);
        this.$timeout(() => {
          this.$scope.$apply();
        });
        this.save({
          savedPatterns: JSON.stringify(this.patterns)
        }, 'Created New Pattern');
      }
    }
  }

  deletePattern(index, event) {
    event.stopPropagation();
    var activatedPattern = -1;
    for (let i in this.patterns) {
      if (this.patterns[i][3] === true) {
        activatedPattern = i;
      }
    }
    if (index === parseInt(activatedPattern)) {
      this.deleteActivationData();
    }
    this.patterns.splice(index, 1);
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      savedPatterns: JSON.stringify(this.patterns)
    }, 'Deleted Pattern');
  }

  deleteActivationData() {
    // using chrome storage because we don't want any message to be displayed
    chrome.storage.local.set({
      translatorService: '',
      translationProbability: '',
      sourceLanguage: '',
      targetLanguage: ''
    });
  }

  changeTranslator() {
    switch (this.translator) {
      case 'Yandex':
        this.languages = lang.yandexLanguages;
        break;
      case 'Google':
        this.languages = lang.googleLanguages;
        break;
      case 'Bing':
        this.languages = lang.bingLanguages;
        break;
      default:
        this.key = '';
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  changeApiKey(translator) {
    switch (translator) {
      case 'Yandex':
        if (/^\s*$/.test(this.yandexTranslatorApiKey) && this.translatorService === 'Yandex') {
          this.deactivatePatterns();
          this.toggleDoNotTranslate();
        }
        /* split is used to remove the extra strings that get added
        at the ended of the copied Yandex key*/
        this.save({
          yandexTranslatorApiKey: this.yandexTranslatorApiKey.split(' ')[0]
        }, 'Updated Yandex API Key');
        break;
      case 'Google':
        if (/^\s*$/.test(this.googleTranslatorApiKey) && this.translatorService === 'Google') {
          this.deactivatePatterns();
          this.toggleDoNotTranslate();
        }
        this.save({
          googleTranslatorApiKey: this.googleTranslatorApiKey
        }, 'Updated Google API key');
        break;
      case 'Bing':
        if ((/^\s*$/.test(this.bingTranslatorApiKey.clientId) || /^\s*$/.test(this.bingTranslatorApiKey.clientSecret)) && this.translatorService === 'Bing') {
          this.deactivatePatterns();
          this.toggleDoNotTranslate();
        }
        this.save({
          bingTranslatorApiKey: this.bingTranslatorApiKey
        }, 'Updated Bing API Key');
        break;
      default:
        console.error('No such translator supported');
    }
  }

  deactivatePatterns() {
    for(let i in this.patterns) {
      this.patterns[i][3] = false;
    }
  }

  toggleDoNotTranslate() {
    this.deactivatePatterns();
    this.doNotTranslate = true;
    this.userDefinedOnly = false;
    this.save({
      translatorService: '',
      translationProbability: '',
      sourceLanguage: '',
      targetLanguage: '',
      savedPatterns: JSON.stringify(this.patterns),
      doNotTranslate: true,
      userDefinedOnly: false
    }, 'Turned off Translations');
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  toggleUserDefinedOnly() {
    this.deactivatePatterns();
    this.userDefinedOnly = true;
    this.doNotTranslate = false;
    this.save({
      translatorService: '',
      translationProbability: '',
      sourceLanguage: '',
      targetLanguage: '',
      savedPatterns: JSON.stringify(this.patterns),
      doNotTranslate: false,
      userDefinedOnly: true
    }, 'User Defined Transltions only');
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  setKeyAlert() {
    switch (this.translatorService) {
      case 'Google':
        if (this.googleTranslatorApiKey === '') {
          this.keyAlert = true;
        }
        break;
      case 'Yandex':
        if (this.yandexTranslatorApiKey === '') {
          this.keyAlert = true;
        }
        break;
      case 'Bing':
        if (this.bingTranslatorApiKey === '') {
          this.keyAlert = true;
        }
        break;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  hasKey(translator) {
    switch (translator) {
      case 'Google':
        return /^\s*$/.test(this.googleTranslatorApiKey);
      case 'Yandex':
        return /^\s*$/.test(this.yandexTranslatorApiKey);
      case 'Bing':
        return /^\s*$/.test(this.bingTranslatorApiKey.clientId) || /^\s*$/.test(this.bingTranslatorApiKey.clientSecret);
      default:

    }
  }

  noKeys() {
    if (!/^\s*$/.test(this.googleTranslatorApiKey) || !/^\s*$/.test(this.yandexTranslatorApiKey) || !(/^\s*$/.test(this.bingTranslatorApiKey.clientId) || /^\s*$/.test(this.bingTranslatorApiKey.clientSecret))) {
      return false;
    }
    return true;
  }
  /******************************************************************************/

  updatePlaybackOptions() {
    var playbackOpts = JSON.stringify({
      'volume': this.volume,
      'rate': this.rate,
      'voiceName': this.voiceName,
      'pitch': this.pitch
    });
    this.save({playbackOptions: playbackOpts}, 'Updated Playback Options');
  }

  /************************ BLACKLISTING FUNCTIONS ****************************/

  addBlackListedWord() {
    if (/^\s*$/.test(this.newBlacklistWord) === false && this.blacklistedWords.indexOf(this.newBlacklistWord) === -1) {
      this.blacklistedWords.push(this.newBlacklistWord.trim());
      this.newBlacklistWord = '';
      this.blacklistWordPage = this.range(this.blacklistedWords.length).length - 1;
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        userBlacklistedWords: '(' + this.blacklistedWords.join('|') + ')'
      }, 'Blacklisted Word');
    }
  }

  removeBlackListedWord(word) {
    this.blacklistedWords.splice(this.blacklistedWords.indexOf(word), 1);
    // check if the word is last on the page
    if (this.blacklistedWords.length % 4 === 0) {
      this.blacklistWordPage -= 1;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      userBlacklistedWords: '(' + this.blacklistedWords.join('|') + ')'
    }, 'Whitelisted Word');
  }

  addBlackListedWebsite() {
    if (/^\s*$/.test(this.newBlacklistWebsite) === false && this.blacklistedWebsites.indexOf(this.newBlacklistWebsite) === -1) {
      this.blacklistedWebsites.push(this.newBlacklistWebsite.trim());
      this.newBlacklistWebsite = '';
      this.blacklistWebsitePage = this.range(this.blacklistedWebsites.length).length - 1; //set to last page
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        blacklist: '(' + this.blacklistedWebsites.join('|') + ')'
      }, 'Blacklisted Website');
    }
  }

  removeBlackListedWebsite(website) {
    this.blacklistedWebsites.splice(this.blacklistedWebsites.indexOf(website), 1);
    // check if the website is last on the page
    if (this.blacklistedWebsites.length % 4 === 0) {
      this.blacklistWebsitePage -= 1;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      blacklist: '(' + this.blacklistedWebsites.join('|') + ')'
    }, 'Whitelisted Website');
  }

  updateWordToggles() {
    this.save({
      wordToggles: this.wordToggles
    }, 'Updated Maximum Word Toggles');
  }

  updateActivationToggles() {
    this.save({
      activationToggles: this.activationToggles
    }, 'Updated Maximum Activation Toggles');
  }

  setAutoBlacklist(value) {
    this.autoBlacklist = value;
    this.save({
      autoBlacklist : value
    }, 'Toggled Automatic Blacklisting');
  }

  /*****************************************************************************/
  /************************ DIFFICULTY BUCKET FUNCTIONS ****************************/

  addWordToDifficultyBucket(word, difficultyLevel){
    if (/^\s*$/.test(this.newDifficultyBucketWord) === false){
      switch (this.newDifficultyBucketWordLevel) {
        case 'Easy':
          this.difficultyBuckets[this.newDifficultyBucketWord] = 'e';
          break;
        case 'Normal':
          this.difficultyBuckets[this.newDifficultyBucketWord] = 'n';
          break;
        case 'Hard':
          this.difficultyBuckets[this.newDifficultyBucketWord] = 'h';
          break;
      }
      this.newDifficultyBucketWord = '';
      this.newDifficultyBucketWordLevel = '';
      this.difficultyBucketsWords = Object.keys(this.difficultyBuckets);
      this.difficultyBucketsWordPage = this.range(this.difficultyBucketsWords.length).length - 1; //set to last page
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        difficultyBuckets: JSON.stringify(this.difficultyBuckets)
      }, 'Word added to difficulty bucket');
    }
  }

  removeWordFromDifficultyBucket(word){
    let difficultyBuckets = this.difficultyBuckets;
    Object.keys(difficultyBuckets).forEach(function(key) {
      if(key === word) {
        delete difficultyBuckets[word];
      }
    });

    this.difficultyBucketsWords = Object.keys(this.difficultyBuckets);

    // check if the word is last on the page
    if (Object.keys(difficultyBuckets).length % 4 === 0) {
      this.difficultyBucketsWordPage -= 1;
    }

    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      difficultyBuckets: JSON.stringify(difficultyBuckets)},
      'Deleted word from difficulty bucket');
  }

  /*****************************************************************************/
  /************************ USER TRANSLATION FUNCTIONS ****************************/

  toList(data) {
    let list = [];
    for(let i in data) {
      list.push([i, data[i]]);
    }
    return list;
  }

  addUserDefinedTranslation() {
    if (/^\s*$/.test(this.original) === false && /^\s*$/.test(this.translated) === false) {
      this.userDefinedTranslations[this.original] = this.translated;
      this.userDefinedTranslationList = this.toList(this.userDefinedTranslations);
      this.userDefinedTranslationPage = this.range(this.userDefinedTranslationList.length).length - 1;
      this.original = '';
      this.translated = '';
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        userDefinedTranslations: JSON.stringify(this.userDefinedTranslations)
      }, 'Added Translation');
    }
  }

  removeUserDefinedTranslation(original) {
    delete this.userDefinedTranslations[original];
    this.userDefinedTranslationList = this.toList(this.userDefinedTranslations);
    if (this.userDefinedTranslationList.length % 4 === 0) {
      this.userDefinedTranslationPage -= 1;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      userDefinedTranslations: JSON.stringify(this.userDefinedTranslations)
    }, 'Removed Translation');
  }

  saveTranslation() {
    if (/^\s*$/.test(this.original) === false && /^\s*$/.test(this.translated) === false) {
      this.savedTranslations[this.original] = this.translated;
      this.savedTranslationList = this.toList(this.savedTranslations);
      this.savedTranslationPage = this.range(this.savedTranslationList.length).length - 1;
      this.original = '';
      this.translated = '';
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        savedTranslations: JSON.stringify(this.savedTranslations)
      }, 'Added Translation');
    }
  }

  removeSavedTranslation(original){
    delete this.savedTranslations[original];
    this.savedTranslationList = this.toList(this.savedTranslations);
    if (this.savedTranslationList.length % 4 === 0) {
      this.savedTranslationPage -= 1;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      savedTranslations: JSON.stringify(this.savedTranslations)
    }, 'Removed Translation');
  }

  /*****************************************************************************/

  /************************ LEARNT WORDS FUNCTIONS ****************************/

  addLearntWord() {
    if (/^\s*$/.test(this.newLearntWord) === false && this.learntWords.indexOf(this.newLearntWord) === -1) {
      this.learntWords.push(this.newLearntWord.trim());
      this.newLearntWord = '';
      this.learntWordPage = this.range(this.learntWords.length).length - 1;
      this.$timeout(() => {
        this.$scope.$apply();
      });
      this.save({
        learntWords: '(' + this.learntWords.join('|') + ')'
      }, 'New learnt word added');
    }
  }

  removeLearntWord(word) {
    this.learntWords.splice(this.learntWords.indexOf(word), 1);
    // TODO: check pagination!
    // check if the word is last on the page
    if (this.learntWords.length % 4 === 0) {
      this.learntWordPage -= 1;
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      learntWords: '(' + this.learntWords.join('|') + ')'
    }, 'Removed from learnt list');
  }

  /*****************************************************************************/

  /************************ WORD CONFIGURATION FUNCTIONS ****************************/

  setMinWordLength() {
    // add error checks
    this.save({minimumSourceWordLength: this.minWordLength}, 'Changed minimum Word Length');
  }

  setNgramMin() {
    // error checks
    this.save({ngramMin: this.ngramMin}, 'Changed minimum N-gram');
  }

  setNgramMax() {
    // error checks
    this.save({ngramMax: this.ngramMax}, 'Changed maximum N-gram');
  }

  /****************************************************************************/

  /************************ STATS FUNCTIONS ****************************/

  resetTotalWordCount(){
    this.stats.totalWordsTranslated = 0;
    this.save({stats: JSON.stringify(this.stats)}, 'Total translated word count has been reset');
  }

  /****************************************************************************/

  /************************ ADJUSTMENT FUNCTIONS ****************************/

  intializeStyleOptions() {
    this.textColor = this.cssOptions[1].split(':')[1];
    this.backColor = this.cssOptions[2].split(':')[1];
  }

  setTextColor(data) {
    this.cssOptions[1] = 'color:' + data.color.toHex();
    this.translatedWordStyle = this.cssOptions.join(';');
    this.$timeout(() => {
      this.$scope.$apply();
    });
    // calling chrome.storage directly because we don't want success message
    chrome.storage.local.set({translatedWordStyle: this.cssOptions.join(';')});
  }

  setBackgroundColor(data) {
    this.cssOptions[2] = 'background-color:' + data.color.toHex();
    this.translatedWordStyle = this.cssOptions.join(';');
    this.$timeout(() => {
      this.$scope.$apply();
    });
    // calling chrome.storage directly because we don't want success message
    chrome.storage.local.set({translatedWordStyle: this.cssOptions.join(';')});
  }

  /**************************************************************************/

  /****************************** BACKUP FUNCTIONS ***********************/

  resetConfig() {
    chrome.storage.local.clear();
    chrome.storage.local.set(localData);
    window.location.reload();
  }

  deleteKeys() {
    this.yandexTranslatorApiKey = '';
    this.googleTranslatorApiKey = '';
    this.bingTranslatorApiKey = '';
    this.save({
      yandexTranslatorApiKey: '',
      googleTranslatorApiKey: '',
      bingTranslatorApiKey: ''
    }, 'Removed all API Keys');
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  backupKeys() {
    chrome.storage.local.get(['googleTranslatorApiKey', 'bingTranslatorApiKey', 'yandexTranslatorApiKey'], (data) => {
      saveFile(data, 'mtw_keys.txt');
    });
  }

  backupAll() {
    chrome.storage.local.get(null, (data) => {
      saveFile(data, 'mtw_config.txt');
    });
  }

  validateKeysFile(data) {
    if ('googleTranslatorApiKey' in data && 'bingTranslatorApiKey' in data && 'yandexTranslatorApiKey' in data) {
      return true;
    } else {
      return false;
    }
  }

  restoreKeys() {
    let fileInput = document.getElementById('keys-file');

    fileInput.addEventListener('change', (e) => {
      let file = fileInput.files[0],
        textType = /text.*/;

      if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          var keys = JSON.parse(reader.result);
          if (this.validateKeysFile(keys)) {
            this.googleTranslatorApiKey = keys.googleTranslatorApiKey;
            this.bingTranslatorApiKey = keys.bingTranslatorApiKey;
            this.yandexTranslatorApiKey = keys.yandexTranslatorApiKey;
            this.save(keys, 'Restored keys from file');
            this.$timeout(() => {
              this.$scope.$apply();
            });
          } else {
            this.status('Corrupted File.', 2000, 100, 'danger');
          }
        };
        reader.readAsText(file);
      } else {
        this.status('Unsupported file format.', 2000, 100, 'danger');
      }
    });

    fileInput.click();
  }

  validateConfigFile(data) {
    if (Object.keys(localData).length !== Object.keys(data).length) {
      return false;
    }
    for (let i in localData) {
      if (i in data) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  restoreAll() {
    let fileInput = document.getElementById('config-file');

    fileInput.addEventListener('change', (e) => {
      let file = fileInput.files[0],
        textType = /text.*/;

      if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          var config = JSON.parse(reader.result);
          if (this.validateConfigFile(config)) {
            this.save(config, 'Restored configuration from file');
            window.location.reload();
          } else {
            this.status('Corrupted File.', 2000, 100, 'danger');
          }
        };
        reader.readAsText(file);
      } else {
        this.status('Unsupported file format.', 2000, 100, 'danger');
      }
    });

    fileInput.click();
  }

  /**************************************************************************/

  /****************************** QUIZ FUNCTIONS ***********************/

  checkAnswer(index){
    var words = Object.keys(this.randomTranslatedWordsForQuiz);
    if(this.quizAnswers[index] === this.randomTranslatedWordsForQuiz[words[index]]){
      angular.element('#incorrect-result-' + index).hide();
      angular.element('#correct-result-' + index).show();
    }
    else{
      angular.element('#correct-result-' + index).hide();
      angular.element('#incorrect-result-' + index).show();
    }
  }
  /**************************************************************************/

}

angular.module('MTWOptions', [])
  .controller('OptionCtrl', OptionCtrl)
  .filter('startFrom', startFrom);
