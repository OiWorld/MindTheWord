import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';

class PopupCtrl {
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

  setActivation(value) {
    if (this.activation !== value) {
      this.activation = value;
      chrome.storage.local.set({
        activation: value
      });
      this.$timeout(() => {
        this.$scope.$apply();
      });
    }
  }

  openOptions() {
    this.$window.open('options.html');
  }

  toggleTranslations() {

  }

}

angular.module('MTWPopup', [])
  .controller('PopupCtrl', PopupCtrl);
