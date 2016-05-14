// Convert controller to ES6 classes
import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';


angular.module('MTWPopup', [])
  .controller('PopupCtrl', function ($scope, $timeout, $window) {

    $scope.activation = true;
    $timeout(function(){
      $scope.$apply();
    });

    $scope.setActivation = function(value) {
      if ($scope.activation !== value) {
        $scope.activation = value;
        // call activate
        $timeout(function(){
          $scope.$apply();
        });
      }
    };

    $scope.openOptions = function() {
      $window.open('options.html');
    };
  });
