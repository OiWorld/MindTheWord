import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';
import bootstrapcolorpicker from '../../assets/js/bootstrap-colorpicker.min.js'
import { startFrom } from '../filters/startFrom'

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
    this.blacklistedWebsites = [];
    this.blacklistWordPage = 0;
    this.blacklistWebsitePage = 0;
    this.translator = 'Yandex';
    this.userDefinedTranslations = {};
    this.yandexTranslatorApiKey = '';
    this.googleTranslatorApiKey = '';
    this.bingTranslatorApiKey = '';
    this.minWordLength = 3;
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.cssOptions = [];
    this.percentage = '15';
    this.languages = {
      Albanian: 'sq',
      Arabian: 'ar',
      Armenian: 'hy',
      Azeri: 'az',
      Belarusian: 'be',
      Bosnian: 'bs',
      Bulgarian: 'bg',
      Catalan: 'ca',
      Croatian: 'hr',
      Czech: 'cs',
      Chinese: 'zh',
      Danish: 'da',
      Dutch: 'nl',
      English: 'en',
      Estonian: 'et',
      Finnish: 'fi',
      French: 'fr',
      Georgian: 'ka',
      German: 'de',
      Greek: 'el',
      Hebrew: 'he',
      Hungarian: 'hu',
      Icelandic: 'is',
      Indonesian: 'id',
      Italian: 'it',
      Japanese: 'ja',
      Korean: 'ko',
      Latvian: 'lv',
      Lithuanian: 'lt',
      Macedonian: 'mk',
      Malay: 'ms',
      Maltese: 'mt',
      Norwegian: 'no',
      Polish: 'pl',
      Portuguese: 'pt',
      Romanian: 'ro',
      Russian: 'ru',
      Spanish: 'es',
      Serbian: 'sr',
      Slovak: 'sk',
      Slovenian: 'sl',
      Swedish: 'sv',
      Thai: 'th',
      Turkish: 'tr',
      Ukrainian: 'uk',
      Vietnamese: 'vi'
    };

    this.getData();
    this.setup();
  }

  getData() {
    chrome.storage.local.get(null, (data) => {
      console.log(data);
      this.patterns = JSON.parse(data.savedPatterns);
      this.key = data.yandexTranslatorApiKey;
      this.blacklistedWords = data.userBlacklistedWords.slice(1, -1).split('|');
      this.blacklistedWebsites = data.blacklist.slice(1, -1).split('|');
      this.userDefinedTranslations = JSON.parse(data.userDefinedTranslations);
      this.yandexTranslatorApiKey = data.yandexTranslatorApiKey;
      this.googleTranslatorApiKey = data.googleTranslatorApiKey;
      this.bingTranslatorApiKey = data.bingTranslatorApiKey;
      this.minWordLength = data.minimumSourceWordLength;
      this.ngramMin = data.ngramMin;
      this.ngramMax = data.ngramMax;
      this.cssOptions = data.translatedWordStyle.split(';');
      this.translatedWordStyle = data.translatedWordStyle;
      this.intializeStyleOptions();

      this.$timeout(() => {
        this.$scope.$apply();
      });
    });
  }

  setLanguages(translatorService) {
    // set according to translator
    this.languages = this.languages;
  }

  setup() {
    this.setLanguages();
    $('#text-colorpicker').colorpicker().on('changeColor', (data) => {
      this.setTextColor(data);
    });
    $('#bg-colorpicker').colorpicker().on('changeColor', (data) => {
      this.setBackgroundColor(data);
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

  /*****************************PATTERN FUNCTIONS*****************************/

  activatePattern(index) {
    for(let i in this.patterns) {
      this.patterns[i][3] = false;
    }
    this.patterns[index][3] = true;
    this.save({
      translatorService: this.patterns[index][4],
      translationProbability: this.patterns[index][2],
      sourceLanguage: this.patterns[index][0][0],
      targetLanguage: this.patterns[index][1][0],
      savedPatterns: JSON.stringify(this.patterns)
    }, 'Activated Pattern');
    this.$timeout(() => {
      this.$scope.$apply();
    })
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
          // status('Pattern already exists', 9000, 600, 'error');
        }
      }
      if (duplicateInput === false) {
        this.patterns.push([
          [src[1], src[2]],
          [trg[1], trg[2]],
          prb,
          false,
          translator
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
    this.patterns.splice(index, 1);
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      savedPatterns: JSON.stringify(this.patterns)
    }, 'Deleted Pattern');
  }

  changeTranslator() {
    switch (this.translator) {
      case 'Yandex':
        this.key = this.yandexTranslatorApiKey;
        break;
      case 'Google':
        this.key = this.googleTranslatorApiKey;
        break;
      case 'Bing':
        this.key = this.bingTranslatorApiKey;
        break;
      default:
        this.key = '';
    }
    this.$timeout(() => {
      this.$scope.$apply();
    });
  }

  changeApiKey() {
    switch (this.translator) {
      case 'Yandex':
        /* split is used to remove the extra strings that get added
        at the ended of the copied Yandex key*/
        this.yandexTranslatorApiKey = this.key.split(" ")[0];
        this.save({
          yandexTranslatorApiKey: this.yandexTranslatorApiKey
        }, 'Updated Yandex API Key');
        break;
      case 'Google':
        this.googleTranslatorApiKey = this.key;
        this.save({
          googleTranslatorApiKey: this.googleTranslatorApiKey
        }, 'Updated Google API key');
        break;
      case 'Bing':
        this.bingTranslatorApiKey = this.key;
        this.save({
          bingTranslatorApiKey: this.bingTranslatorApiKey
        }, 'Updated Bing API Key');
        break;
      default:
        console.error('No such translator supported');
    }
  }

  /******************************************************************************/


  /************************ BLACKLISTING FUNCTIONS ****************************/

  addBlackListedWord() {
    if (/\s*/.test(this.newBlacklistWord) === false && this.blacklistedWords.indexOf(this.newBlacklistWord) === -1) {
      this.blacklistedWords.push(this.newBlacklistWord);
      this.newBlacklistWord = '';
      this.blacklistWordPage = this.range(this.blacklistedWords.length).length - 1
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
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      userBlacklistedWords: '(' + this.blacklistedWords.join('|') + ')'
    }, 'Whitelisted Word');
  }

  addBlackListedWebsite() {
    if (/\s*/.test(this.newBlacklistWord) === false && this.blacklistedWebsites.indexOf(this.newBlacklistWebsite) === -1) {
      this.blacklistedWebsites.push(this.newBlacklistWebsite);
      this.newBlacklistWebsite = '';
      this.blacklistWebsitePage = this.range(this.blacklistedWebsites.length).length - 1 //set to last page
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
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      blacklist: '(' + this.blacklistedWebsites.join('|') + ')'
    }, 'Whitelisted Website');
  }


  /*****************************************************************************/
  /************************ USER TRANSLATION FUNCTIONS ****************************/

  addUserDefinedTranslation(original, translated) {
    this.userDefinedTranslations[this.original] = this.translated;
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      userDefinedTranslations: JSON.stringify(this.userDefinedTranslations)
    }, 'Added Translation');
  }

  removeUserDefinedTranslation(original) {
    delete this.userDefinedTranslations[original];
    console.log(this.userDefinedTranslations);
    this.$timeout(() => {
      this.$scope.$apply();
    });
    this.save({
      userDefinedTranslations: JSON.stringify(this.userDefinedTranslations)
    }, 'Removed Translation');
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
    chrome.storage.local.set({translatedWordStyle: this.cssOptions.join(';')})
  }

  setBackgroundColor(data) {
    this.cssOptions[2] = 'background-color:' + data.color.toHex();
    this.translatedWordStyle = this.cssOptions.join(';');
    this.$timeout(() => {
      this.$scope.$apply();
    });
    // calling chrome.storage directly because we don't want success message
    chrome.storage.local.set({translatedWordStyle: this.cssOptions.join(';')})
  }

  setStyles() {

  }

  setCSSStyles() {

  }

  /**************************************************************************/

}

angular.module('MTWOptions', [])
  .controller('OptionCtrl', OptionCtrl)
  .filter('startFrom', startFrom);
