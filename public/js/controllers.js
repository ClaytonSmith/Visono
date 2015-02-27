'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
    $http({method: 'GET', url: '/api/name'}).
	success(function(data, status, headers, config) {
	    console.log(data);
	    $scope.name = data.name;
	}).
	error(function(data, status, headers, config) {
	    $scope.name = 'Error!'
	});

    $scope.alert = function(){
	console.log('Detected mouse event');
    };
}

function homeCtrl($scope, $http) {}
function uploadCtrl($scope, $http){}
function settingsCtrl($scope, $http){}
function viewerCtrl($scope, $http){}
function galleryCtrl($scope, $http){}
function userCtrl($scope, $http){}
function aboutCtrl($scope, $http){}

//DO NOT TOUCH 
// unless you are adding or removing a controller

settingsCtrl. $inject  =  ['$scope', '$http']; 
galleryCtrl.  $inject  =  ['$scope', '$http'];
uploadCtrl.   $inject  =  ['$scope', '$http'];
viewerCtrl.   $inject  =  ['$scope', '$http'];
aboutCtrl.    $inject  =  ['$scope', '$http'];
homeCtrl.     $inject  =  ['$scope', '$http'];
userCtrl.     $inject  =  ['$scope', '$http'];





