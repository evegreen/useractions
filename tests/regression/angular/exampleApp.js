'use strict';

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

  $scope.forClickOnCheckbox = false;
  $scope.checkboxPostScriptExecuted = false;
  var checkboxPostScriptExecuted = false;
  $scope.checkboxPostScript = function () {
    $scope.checkboxPostScriptExecuted = true;
  };

  $scope.buttonWasClickedCount = 0;
  $scope.buttonClicked = function () {
    $scope.buttonWasClickedCount++;
  }

});
