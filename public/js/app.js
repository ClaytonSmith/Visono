/*
 * 
 * 
 *
 *
 *
 */

'use strict';

// Declare app level module which depends on filters, and services                                          
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute', 'angularFileUpload', 'ngResource']);

// Configure angular client side routing
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/home',     {templateUrl: 'partials/home',     controller:     homeCtrl});
    $routeProvider.when('/about',    {templateUrl: 'partials/about',    controller:    aboutCtrl});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings', controller: settingsCtrl});
    $routeProvider.when('/viewer',   {templateUrl: 'partials/viewer',   controller:   viewerCtrl});
    $routeProvider.when('/gallery',  {templateUrl: 'partials/gallery',  controller:  galleryCtrl});
    $routeProvider.when('/sign-up',  {templateUrl: 'partials/sign-up',  controller:     userCtrl});
    $routeProvider.when('/sign-in',  {templateUrl: 'partials/sign-in',  controller:     userCtrl});
    
    //Default path
    $routeProvider.otherwise({redirectTo: '/home'});
    $locationProvider.html5Mode(true);
}]);

/*app.config(['flowFactoryProvider', function (flowFactoryProvider) {
   flowFactoryProvider.defaults = {
	target: '',
	permanentErrors: [500, 501],
	maxChunkRetries: 1,
	chunkRetryInterval: 5000,
	simultaneousUploads: 1
    };        
    
    // flowFactoryProvider.on('catchAll', function (event) {
    // 	console.log('THIS IS A THIGN');
    // 	console.log('catchAll', arguments);
    // });
    
    // Can be used with different implementations of Flow.js
    flowFactoryProvider.factory = fustyFlowFactory;
}]); */




