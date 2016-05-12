// functions
// 1. createPattern
// 2. activatePattern
// 3. changeHighlightPattern
// 4. setMinWordLength
// 5. setNgramMin
// 6. setNgramMax
// 9. addUserDefinedTranslation
// 10. alerts ??
angular.module('MTWOptions', [])
  .controller('OptionCtrl', function($scope, $timeout) {

    $scope.patterns = [];
    $scope.loading = true;
    $scope.translator = 'Yandex';
    $scope.key = '';
    $scope.languages = {};
    $scope.percentage = '15';
    $scope.userDefinedTranslations = {};

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
        $scope.patterns = data.savedPatterns;
        $scope.patterns = JSON.parse(data.savedPatterns);
        $scope.key = data.yandexTranslatorApiKey;
        $scope.blacklistedWords = data.userBlacklistedWords.slice(1, -1).split('|');
        $scope.blacklistedWebsites = data.blacklist.slice(1, -1).split('|');
        $scope.userDefinedTranslations = JSON.parse(data.userDefinedTranslations);
        $timeout(function() {
          $scope.$apply();
        });
        console.log(data);
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
      var patterns = $scope.patterns;
      var src = [],
        trg = [],
        prb;

      var translator = $scope.translator;
      src[0] = document.getElementById('srcLang');
      src[1] = $scope.srcLang;
      src[2] = src[0].children[src[0].selectedIndex].text;
      trg[0] = document.getElementById('targetLang');
      trg[1] = $scope.targetLang;
      trg[2] = trg[0].children[trg[0].selectedIndex].text;
      prb = $scope.percentage;

      var duplicateInput = false; //to check duplicate patterns
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
        $timeout(function(){
          $scope.$apply();
        });
      }

      // TODO: save
    };

    $scope.deletePattern = function(index, event) {
      event.stopPropagation();
      $scope.patterns.splice(index, 1);
      $timeout(function(){
        $scope.$apply();
      });
      // TODO: save
    };

    $scope.buttonChange = function() {
      console.log($scope.button);
    };

    $scope.changeApiKey = function() {
      // add error checks
      switch ($scope.translator) {
        case 'Yandex':
          chrome.storage.local.set({
            yandexTranslatorApiKey: $scope.key
          });
          break;
        case 'Google':
          chrome.storage.local.set({
            googleTranslatorApiKey: $scope.key
          });
          break;
        case 'Bing':
          chrome.storage.local.set({
            bingTranslatorApiKey: $scope.key
          });
          break;
        default:
          console.error('No such translator supported');
      }
    };

    /******************************************************************************/


    /************************ BLACKLISTING FUNCTIONS ****************************/

    $scope.addBlackListedWords = function() {

    };

    $scope.addBlackListedWebsite = function() {

    };

    $scope.removeBlackListedWebsite = function(website) {
      $scope.blacklistedWebsites.splice($scope.blacklistedWebsites.indexOf(website), 1);
      $timeout(function() {
        $scope.$apply();
      });

      //TODO:save the new blackist!!!!!
    };

    $scope.removeBlackListedWord = function(word) {
      $scope.blacklistedWords.splice($scope.blacklistedWords.indexOf(word), 1);
      $timeout(function() {
        $scope.$apply();
      });

      //TODO:save the new blackist!!!!!
    };

    /*****************************************************************************/

    /************************ USER TRANSLATION FUNCTIONS ****************************/

    $scope.addUserDefinedTranslation = function() {

    };

    $scope.removeUserDefinedTranslation = function() {

    };

    /*****************************************************************************/

  });
