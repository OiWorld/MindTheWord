var app = angular.module('PopupApp', []);
app.controller('PopupController', ['$scope', function($scope) {
	$scope.toggleWords = function() {
		chrome.tabs.executeScript(null, {code:"__mindtheword.toggleAllElements();"}, function() {
			$scope.updateData();
		});
	};

	$scope.toggleEnabled = function() {
	    chrome.storage.sync.get("activation", function(data) {
	    	chrome.storage.sync.set({activation: !data.activation}, function() {
				chrome.tabs.executeScript(null, {code:"window.location.reload();"});
				window.close();			
	    	});
    	});
	};

	$scope.options = function() {
		chrome.tabs.create({url:chrome.extension.getURL("options.html")});
		window.close();
	};

	$scope.updateData = function() {
		chrome.tabs.executeScript(null, {code:"__mindtheword.isTranslated()"}, function(translated) {
			$scope.$apply(function() {
				$scope.toggledOn = translated[0];
			});
		});
	    chrome.storage.sync.get(null, function(data) {
	    	$scope.$apply(function() {
	    		$scope.data = data;
			});
    	});
	};
	$scope.updateData();
}]);