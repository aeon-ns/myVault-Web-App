'use strict';

angular.module('myVault')

    .controller('HomeController', ['$scope', function($scope){
        $scope.login = true;
        $scope.setLoginTrue = function(){
            $scope.login = true;
        };
        $scope.setLoginFalse = function(){
            $scope.login = false;
        }
    }])