// TODO
// set form values
// alerts ??
angular.module('MTWOptions', [])
  .controller('OptionCtrl', function($scope, $timeout) {

    $scope.patterns = [];
    $scope.loading = true;
    $scope.translator = 'Yandex';
    $scope.key = '';
    $scope.languages = {};
    $scope.percentage = '15';
    $scope.userDefinedTranslations = {};
    //TODO: Complete initialization list

    var languages = {
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

    function getData() {
      chrome.storage.local.get(null, function(data) {
        console.log(data);
        $scope.patterns = JSON.parse(data.savedPatterns);
        $scope.key = data.yandexTranslatorApiKey;
        $scope.blacklistedWords = data.userBlacklistedWords.slice(1, -1).split('|');
        $scope.blacklistedWebsites = data.blacklist.slice(1, -1).split('|');
        $scope.userDefinedTranslations = JSON.parse(data.userDefinedTranslations);
        $scope.yandexTranslatorApiKey = data.yandexTranslatorApiKey;
        $scope.googleTranslatorApiKey = data.googleTranslatorApiKey;
        $scope.bingTranslatorApiKey = data.bingTranslatorApiKey;
        $timeout(function() {
          $scope.$apply();
        });
      });
    }
    getData();

    function setLanguages(translatorService) {
      // set according to translator
      $scope.languages = languages;
    }

    function setup() {
      setLanguages();
      $(function() {
        $('#colorpicker').colorpicker();
      });
    }
    setup();

    function status(text, duration, fade, type) {
      (function(text, duration, fade) {
        var status = document.createElement('div');
        status.className = 'alert alert-' + type;
        status.innerText = text;
        document.getElementById('status').appendChild(status);

        setTimeout(function() {
          var opacity = 1,
            ntrvl = setInterval(function() {
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

    function save(data, successMessage) {
      chrome.storage.local.set(data, function(error) {
        if (error) {
          status('Error Occurred. Please refresh.', 1000, 100, 'danger');
        } else {
          status(successMessage, 1000, 100, 'success');
        }
      });
    }

    /*****************************PATTERN FUNCTIONS*****************************/

    $scope.activatePattern = function(srcLang, targetLang, percentage, translator) {
      chrome.storage.local.set({
        sourceLanguage: srcLang,
        targetLanguage: targetLang,
        translationProbability: percentage,
        translatorService: translator
      });
    };

    $scope.createPattern = function(language) {
      var patterns = $scope.patterns,
        src = [],
        trg = [],
        prb,
        duplicateInput = false, //to check duplicate patterns
        translator = $scope.translator;

      src[0] = document.getElementById('srcLang');
      src[1] = $scope.srcLang;
      src[2] = src[0].children[src[0].selectedIndex].text;
      trg[0] = document.getElementById('targetLang');
      trg[1] = $scope.targetLang;
      trg[2] = trg[0].children[trg[0].selectedIndex].text;
      prb = $scope.percentage;

      for (var index in patterns) {
        if (patterns[index][0][0] === src[1] && patterns[index][1][0] === trg[1] && patterns[index][2] === prb && patterns[index][4] === translator) {
          duplicateInput = true;
          // status('Pattern already exists', 9000, 600, 'error');
        }
      }
      if (duplicateInput === false) {
        $scope.patterns.push([
          [src[1], src[2]],
          [trg[1], trg[2]],
          prb,
          false,
          translator
        ]);
        $timeout(function() {
          $scope.$apply();
        });
        save({
          savedPatterns: JSON.stringify($scope.patterns)
        }, 'Created New Pattern');
      }
    };

    $scope.deletePattern = function(index, event) {
      event.stopPropagation();
      $scope.patterns.splice(index, 1);
      $timeout(function() {
        $scope.$apply();
      });
      save({
        savedPatterns: JSON.stringify($scope.patterns)
      }, 'Deleted Pattern');
    };

    $scope.changeTranslator = function() {
      switch ($scope.translator) {
        case 'Yandex':
          $scope.key = $scope.yandexTranslatorApiKey;
          break;
        case 'Google':
          $scope.key = $scope.googleTranslatorApiKey;
          break;
        case 'Bing':
          $scope.key = $scope.bingTranslatorApiKey;
          break;
        default:
          $scope.key = '';
      }
      $timeout(function() {
        $scope.$apply();
      });
    };

    $scope.changeApiKey = function() {
      switch ($scope.translator) {
        case 'Yandex':
          $scope.yandexTranslatorApiKey = $scope.key;
          save({
            yandexTranslatorApiKey: $scope.yandexTranslatorApiKey
          }, 'Changed Yandex API Key');
          break;
        case 'Google':
          $scope.googleTranslatorApiKey = $scope.key;
          save({
            googleTranslatorApiKey: $scope.googleTranslatorApiKey
          }, 'Changed Google API key');
          break;
        case 'Bing':
          $scope.bingTranslatorApiKey = $scope.key;
          save({
            bingTranslatorApiKey: $scope.bingTranslatorApiKey
          }, 'Changed Bing API Key');
          break;
        default:
          console.error('No such translator supported');
      }
    };

    /******************************************************************************/


    /************************ BLACKLISTING FUNCTIONS ****************************/

    $scope.addBlackListedWord = function() {
      if ($scope.blacklistedWords.indexOf($scope.newBlacklistWord) == -1) {
        $scope.blacklistedWords.push($scope.newBlacklistWord);
        $timeout(function() {
          $scope.$apply();
        });
        save({
          userBlacklistedWords: '(' + $scope.blacklistedWords.join('|') + ')'
        }, 'Blacklisted Word');
      }
    };

    $scope.removeBlackListedWord = function(word) {
      $scope.blacklistedWords.splice($scope.blacklistedWords.indexOf(word), 1);
      $timeout(function() {
        $scope.$apply();
      });
      save({
        userBlacklistedWords: '(' + $scope.blacklistedWords.join('|') + ')'
      }, 'Whitelisted Word');
    };

    $scope.addBlackListedWebsite = function() {
      if ($scope.blacklistedWebsites.indexOf($scope.newBlacklistWebsite) == -1) {
        $scope.blacklistedWebsites.push($scope.newBlacklistWebsite);
        $timeout(function() {
          $scope.$apply();
        });
        save({
          blacklist: '(' + $scope.blacklistedWebsites.join('|') + ')'
        }, 'Blacklisted Website');
      }
    };

    $scope.removeBlackListedWebsite = function(website) {
      $scope.blacklistedWebsites.splice($scope.blacklistedWebsites.indexOf(website), 1);
      $timeout(function() {
        $scope.$apply();
      });
      save({
        blacklist: '(' + $scope.blacklistedWebsites.join('|') + ')'
      }, 'Whitelisted Website');
    };


    /*****************************************************************************/

    /************************ USER TRANSLATION FUNCTIONS ****************************/

    $scope.addUserDefinedTranslation = function(original, translated) {
      $scope.userDefinedTranslations[$scope.original] = $scope.translated;
      $timeout(function() {
        $scope.$apply();
      });
      save({
        userDefinedTranslations: JSON.stringify($scope.userDefinedTranslations)
      }, 'Added Translation');
    };

    $scope.removeUserDefinedTranslation = function(original) {
      delete $scope.userDefinedTranslations[original];
      console.log($scope.userDefinedTranslations);
      $timeout(function() {
        $scope.$apply();
      });
      save({
        userDefinedTranslations: JSON.stringify($scope.userDefinedTranslations)
      }, 'Removed Translation');
    };

    /*****************************************************************************/

    /************************ WORD CONFIGURATION FUNCTIONS ****************************/

    $scope.setMinWordLength = function() {
      // add error checks
      save({
        minimumSourceWordLength: $scope.minWordLength
      }, 'Changed minimum Word Length');
    };

    $scope.setNgramMin = function() {
      // error checks
      save({
        ngramMin: $scope.ngramMin
      }, 'Changed minimum N-gram');
    };

    $scope.setNgramMax = function() {
      // error checks
      save({
        ngramMax: $scope.ngramMax
      }, 'Changed maximum N-gram');
    };

    /****************************************************************************/

    /************************ ADJUSTMENT FUNCTIONS ****************************/

    $scope.setHighlightColor = function() {

    };

    $scope.setStyles = function() {

    };

    $scope.setCSSStyles = function() {

    };

    /**************************************************************************/


  });
