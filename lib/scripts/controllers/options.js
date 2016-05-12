// functions
// 1. createPattern
// 2. activatePattern
// 3. changeHighlightPattern
// 4. setMinWordLength
// 5. setNgramMin
// 6. setNgramMax
// 7. addBlackListedWebsite
// 8. addBlackListedWords
// 9. addUserDefinedTranslation
// 10. alerts ??
angular.module('MTWOptions', [])
  .controller('OptionCtrl', function($scope, $timeout) {

    $scope.patterns = [];
    $scope.loading = true;
    $scope.translator = 'Yandex';
    $scope.key = '';

    function getData() {
      chrome.storage.local.get(null, function(data) {
        $scope.patterns = data.savedPatterns;
        $scope.patterns = JSON.parse(data.savedPatterns);
        $scope.key = data.yandexTranslatorApiKey;
        $timeout(function() {
          $scope.$apply();
        });
        console.log(data);
      });
    }
    getData();

    function setup() {
      $(function() {
        $('#colorpicker').colorpicker();
      });
    }
    setup();

    $scope.activatePattern = function(srcLang, targetLang, percentage, translator) {
      chrome.storage.local.set({
        sourceLanguage: srcLang,
        targetLanguage: targetLang,
        translationProbability: percentage,
        translatorService: translator
      });
    };

    $scope.createPattern = function() {
      var patterns = $scope.patterns;
      var src = [],
        trg = [],
        prb = [];

      var translator = $scope.translator;
      src[0] = document.getElementById('sourceLanguage');
      src[1] = src[0].children[src[0].selectedIndex].value;
      src[2] = src[0].children[src[0].selectedIndex].text;
      trg[0] = document.getElementById('targetLanguage');
      trg[1] = trg[0].children[trg[0].selectedIndex].value;
      trg[2] = trg[0].children[trg[0].selectedIndex].text;
      prb[0] = document.getElementById('translationProbability');
      prb[1] = prb[0].children[prb[0].selectedIndex].value;

      var duplicateInput = false; //to check duplicate patterns
      for (var index in patterns) {
        if (patterns[index][0][0] === src[1] && patterns[index][1][0] === trg[1] && patterns[index][2] === prb[1] && patterns[index][4] === service) {
          duplicateInput = true;
          status('Pattern already exists', 9000, 600, 'error');
        }
      }

      if (duplicateInput === false) {
        patterns.push([
          [src[1], src[2]],
          [trg[1], trg[2]],
          prb[1],
          false,
          service
        ]);
      }
    };

    $scope.deletePattern = function() {

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

  });
