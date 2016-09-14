var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
  $scope.firstname = "John";
  $scope.lastname = "Doe";

  $scope.forClickOnCheckbox = false;
  $scope.checkboxPostScriptExecuted = false;
  var checkboxPostScriptExecuted = false;
  $scope.checkboxPostScript = function () {
    $scope.checkboxPostScriptExecuted = true;
  };
});
