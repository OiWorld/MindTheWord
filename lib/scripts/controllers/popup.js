import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';

class PopupCtrl {
  constructor($scope, $timeout, $window) {
    this.$timeout = $timeout;
    this.$window = $window;
    this.$scope = $scope;
    this.activation = true;
    this.$timeout(function(){
      this.$scope.$apply();
    });
  }

  setActivation(value) {
    if (this.activation !== value) {
      this.activation = value;
      // call activate
      this.$timeout(function(){
        this.$scope.$apply();
      });
    }
  }

  openOptions() {
    this.$window.open('options.html');
  }
}


angular.module('MTWPopup', [])
  .controller('PopupCtrl', PopupCtrl);
