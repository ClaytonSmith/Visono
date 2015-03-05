'use strict';

/* Controllers */

function AppCtrl($scope, $http, $location) {
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

function homeCtrl($scope, $http, $location, $upload) {
    
    // TEMP VALUE, CHANGE WHEN NOT IN DEV MODE.
    $scope.test = false;
    
    $scope.changeView = function(){
	$location.path('/settings');
    }
    
    $scope.$watch('files', function () {
	$scope.upload($scope.files);
    });
    
    $scope.upload = function (files) {
	if (files && files.length) {
	console.log('File has been given');
	    $scope.test = true;
	 
	// Working upload 
	/* if (files && files.length) {
           for (var i = 0; i < files.length; i++) {
           var file = files[i];
           $upload.upload({
           url: 'upload/url',
           fields: {'username': $scope.username},
           file: file
           }).progress(function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
           }).success(function (data, status, headers, config) {
           console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
           });
           }
           }*/
	}
    };
}

function settingsCtrl($scope, $http, $location){}

function uploadCtrl($scope, $http, $location){}

function viewerCtrl($scope, $http, $location){}
function galleryCtrl($scope, $http, $location){}
function userCtrl($scope, $http, $location){}
function aboutCtrl($scope, $http, $location){}

//DO NOT TOUCH 
// unless you are adding or removing a controller

settingsCtrl. $inject  =  ['$scope', '$http', '$location']; 
galleryCtrl.  $inject  =  ['$scope', '$http', '$location'];
uploadCtrl.   $inject  =  ['$scope', '$http', '$location'];
viewerCtrl.   $inject  =  ['$scope', '$http', '$location'];
aboutCtrl.    $inject  =  ['$scope', '$http', '$location'];
homeCtrl.     $inject  =  ['$scope', '$http', '$location', '$upload'];
userCtrl.     $inject  =  ['$scope', '$http', '$location'];





