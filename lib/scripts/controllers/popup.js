import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';

/** Class for popup angular controller */
export class PopupCtrl {
  /**
   * Initialize activation data.
   * @constructor
   * @param {Object} $scope - Angular scope
   * @param {Object} $timeout - Angular timeout
   * @param {Object} $window - Angular window
   */
  constructor($scope, $timeout, $window) {
    this.$timeout = $timeout;
    this.$window = $window;
    this.$scope = $scope;

    chrome.storage.local.get(null, (data) => {
      this.activation = data.activation;
      this.$timeout(() => {
        this.$scope.$apply();
      });
    });
  }

  /**
   * Store user activation data to chrome local storage
   * @param {string} - activation value set by the user
   */
  setActivation(value) {
    if (this.activation !== value) {
      this.activation = value;
      chrome.storage.local.set({activation: value});
      chrome.tabs.getSelected(null, function(tab) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {code: code});
      });
    }
  }

  /**
   * Redirect user to options.html from popup
   */
  openOptions() {
    this.$window.open('options.html');
  }

  /**
   * Toggle all translated words on active tab.
   * Sends a message to the content script to run
   * its toggle function on the tab.
   */
  toggleTranslations() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'toggleAllElements'});
    });
  }

}

angular.module('MTWPopup', [])
  .controller('PopupCtrl', PopupCtrl);
