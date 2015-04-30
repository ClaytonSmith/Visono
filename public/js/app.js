/*
 * 
 * 
 *
 *
 *
 */

'use strict';

// Declare app level module which depends on filters, and services                                          
var app = angular.module('myApp', ['myApp.filters',
				   'myApp.services',
				   'myApp.directives',
				   'ngRoute',
				   'angularFileUpload',
				   'colorpicker.module',
				   'myColorPicker',
				   'myModal',
				   'ui.bootstrap',
				   'ngResource']);

// Configure angular client side routing
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/home',     {templateUrl: 'partials/home',     controller:      homeCtrl});
    $routeProvider.when('/about',    {templateUrl: 'partials/about',    controller:     aboutCtrl});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings', controller:  settingsCtrl});
    $routeProvider.when('/viewer',   {templateUrl: 'partials/viewer',   controller:    viewerCtrl});
    $routeProvider.when('/gallery',  {templateUrl: 'partials/gallery',  controller:   galleryCtrl});
    $routeProvider.when('/sign-up',  {templateUrl: 'partials/sign-up',  controller:  registerCtrl});
    $routeProvider.when('/sign-in',  {templateUrl: 'partials/sign-in',  controller:  registerCtrl});
    $routeProvider.when('/myPage',   {templateUrl: 'partials/myPage',   controller:    myPageCtrl});
    
    //Default path
    $routeProvider.otherwise({redirectTo: '/home'});
    $locationProvider.html5Mode(true);
}]);



