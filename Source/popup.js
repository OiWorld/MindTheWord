var app = angular.module('PopupApp', []);
app.controller('PopupController', ['$scope', scopefunction($scope)]);
function scopefunction($scope) {
  $scope.toggleWords = function() {
    chrome.tabs.executeScript(null, {code: '__mindtheword.toggleAllElements();'}, function() {
      $scope.updateData();
		});
	};
  $scope.toggleEnabled = function() {
    chrome.storage.local.get('activation',active(data));
  };
 function active(data) {
      chrome.storage.local.set({activation: !data.activation}, exec());
	  }
  function exec(){
        chrome.tabs.executeScript(null, {code: 'window.location.reload();'});
        window.close();
      }
  $scope.options = function() {
    chrome.tabs.create({url: chrome.extension.getURL('options.html')});
    window.close();
  };
  $scope.updateData = function() {
    chrome.tabs.executeScript(null, {code: '__mindtheword.isTranslated()'},wtranslate(translated));
    chrome.storage.local.get(null, getdata(data));
  };
  function getdata(data){
      $scope.$apply(function() {
        $scope.data = data;
      });
    }
  function wtranslate(translated){
      $scope.$apply(function() {
        $scope.toggledOn = translated[0];
      });
    }
  $scope.updateData();
}
