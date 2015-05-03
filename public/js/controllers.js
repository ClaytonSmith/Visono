
/***
 * Project: Visono
 * File: public/js/controller.js
 * 
 * Authors: Clayton Smith / Mark McGrotty / Shaun Confrey
 *
 *  Copyright (c) 2015 by Visono development team
 *      All rights reserved. May be freely copied or excerpted for
 *      any purpose with credit to the author.
 ***/


'use strict';

/* Controllers */

// Helper function 
// Tests to see if an object is empty.
function isEmptyObject(obj){
    for(var propName in obj){
        if(obj.hasOwnProperty(propName)){
            return false;
        }
    }
    return true;
}

// Helper function
// Returns a true if a list contains an element.
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

// Global APP controller 
function AppCtrl($scope, $http, $location, $rootScope) {
    
    $rootScope.visualizer = {} ;
    $rootScope.visualizer.settings = {} ;

    $rootScope.userData = null;
    $rootScope.file     = null;
    $rootScope.fileName = null;    
    $scope.hasUserData  = false;
    
    
    $scope.logOut = function(){
	$rootScope.visualizer = {} ;
	$rootScope.visualizer.settings = {} ;
	//$rootScope.userData = null;
	$rootScope.file     = null;
	$rootScope.fileName = null;    
	$scope.hasUserData  = false;
    }
    
    // Saves users data to rootScope
    $rootScope.$watch('userData', function(newValue, oldValue) {
	//update the DOM with newValue	
	if(newValue === oldValue){
	    return ;
	} else if(newValue === null){
	    $scope.hasUserData = false;
	} else {
	    $scope.hasUserData = true;	
	}
    });
    
    
    $http({method: 'GET', url: '/api/info'}).
	success(function(data, status, headers, config) {
	    $rootScope.globalData = data;
	    console.log( data );
	}).
	error(function(data, status, headers, config) {
	    $scope.name = 'Error!'
	});


    // Converts array of hex colors to a css string
    $scope.getCssColors = function(colors){
	var cssString = "linear-gradient(to right, "
	console.log( "getting data" );
	console.log( colors );
	var step   = 100 / colors.length;
	console.log( step );
	
	for( var i = 0; i < colors.length; i++){
	    cssString += colors[i] + ' ' + String( i * step ) + '%, ';
	    
	    if( (i+1) == colors.length ){
		cssString += colors[i] + ' 100%)';
	    } else {
		cssString += colors[i] + ' ' + String( (i+1) * step ) + '%, ';
	    }
	}
	console.log( cssString);
	return cssString;
    }
    
    // Routing
    $scope.toHome     = function(){$location.path('/home'); }
    $scope.toSettings = function(){$location.path('/settings'); }
    $scope.toViewer   = function(){$location.path('viewer'); }
    $scope.toLogIn    = function(){$location.path('sign-in'); }
    $scope.toSignUp   = function(){$location.path('sign-up'); }
    $scope.toAbout    = function(){$location.path('about'); }
}

function homeCtrl($scope, $http, $location, $rootScope, $upload) {
    
    // TEMP VALUE, CHANGE WHEN NOT IN DEV MODE.
    $scope.showNext         = false;
    $scope.fileName         = '';
    $scope.fileNotSupported = false;
    $scope.uploadStat       = 0;
    $scope.showUpload       = false;
    $scope.max              = 100;

    // Auto-load files once they have been supplied
    $scope.$watch('files', function () {
	$scope.upload($scope.files[$scope.files.length -1]);
    });

    // Upload file to server
    $scope.upload = function (file) {
	if (file) {
	    $rootScope.visualizer = {};
	    $rootScope.visualizer.settings = {};
	    
	    console.log('File has been given');
	    console.log(file);
	    $scope.fileName = "File: " + file.name; 
	    
	    $rootScope.file = file; 
	    $rootScope.visualizer.title = file.name;
	    
	    // Check to meka sure files are of the proper type
	    if( ($rootScope.file.type == "audio/mp3") ||
		($rootScope.file.type == "audio/wav") ){ 
		$scope.fileNotSupported = false;
		$scope.showNext         = true;	    
		
	    } else {
		$scope.fileNotSupported = true;
		$scope.showNext         = false;
		$scope.showUpload       = false;
		return null;
	    }

	    console.log( "FILE UPLOAD", isEmptyObject( $rootScope.visualizer.settings ), $rootScope.visualizer.settings  );
	    
	    // Working upload 
	    if (file) {
		$upload.upload({
		    url: 'upload',
		    file: file
		}).progress(function (evt) {
		    $scope.showUpload = true;
		    $scope.uploadStat = parseInt(100.0 * evt.loaded / evt.total);
		    console.log('progress: ' + $scope.uploadStat + '% ' + evt.config.file.name);
		}).success(function (data, status, headers, config) {
		    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		});
	    }
	}	
    };
}

// Gallery controller
function galleryCtrl($scope, $http, $location, $rootScope){
    
    $http.get('/api/get_visualizers').
	success(function(data){
	    $scope.visualizers = data;
	    console.log(data);
	});
        
    // Load visualizer data
    $scope.loadVis = function(vis){
	
	$rootScope.visualizer = vis ;
	$rootScope.visualizer.saved = true;	

	$rootScope.fileName   = vis.name;
	$rootScope.visDat     = vis.settings;
	$rootScope.author     = vis.author;
	$rootScope._id        = vis._id;
	
	$location.path('/viewer');
    }

    $scope.randColor = function(){
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
    }
}


function settingsCtrl($scope, $http, $location, $rootScope){
    
    if( $rootScope.visualizer == null ){
	console.log("You can't be on this page without a media file.");
	// $location.path('/home');
    }
    
    $scope.uschiColor = '#00ff00';
    $scope.onChange = function(color) {
	console.log('onChange event', color);
    };

    /******* Init *******/
    $scope.show                = false;
    $scope.visData             = {};
    $scope.visData.settings    = {};
    
    // Default values
    $scope.visData.title                    = $rootScope.visualizer.title;
    $scope.visData.settings.size            = 5;
    $scope.visData.settings.speed           = 2;
    $scope.visData.settings.lineWidth       = 5;
    $scope.visData.settings.particleNum     = 40;
    $scope.visData.settings.colors          = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'] ;
    $scope.visData.settings.backgroundColor = '#000000';
    
    /**** testing ****/
    console.log( $scope.visData.settings.colors );
    console.log( $rootScope.visualizer );
    console.log( "THIS", isEmptyObject( $rootScope.visualizer.settings ), $rootScope.visualizer.settings  );
    

    // Load user settings if they exist
    $scope.visData = (!isEmptyObject( $rootScope.visualizer.settings ))? $rootScope.visualizer : $scope.visData ;
    
    /********************/    
    
    // Add color to users color collection
    $scope.addColor = function(color){
	console.log( $scope.visData.settings.colors );        
	if( $scope.visData.settings.colors.length >= 8) return ;
	$scope.visData.settings.colors.push(color);
    }
    
    // Force update to css color collection 
    $scope.$watch('tempColor', function(newValue, oldValue) {
	console.log( newValue );
	if(!newValue) return ;
	$scope.addColor(newValue);
    });
    
    
    // Remove color from collection
    $scope.removeColor = function(index){
	if( $scope.visData.settings.colors.length <= 1) return ;
	$scope.visData.settings.colors.splice( index, 1);
    }
    
    // Validate settings
    $scope.validateSettings = function(data){
	console.log( data.settings );
	$rootScope.visualizer.settings = data.settings ;
	$rootScope.visualizer.title    = data.title ;
	$rootScope.visualizer.saved    = false;
	$location.path('viewer');
    }   
}

function uploadCtrl($scope, $http, $location, $rootScope){
    // BLANK
}


function viewerCtrl($scope, $http, $location, $rootScope, $anchorScroll){
    
    // scroll to title and visualizer
    $anchorScroll();
    
    /******* MODEL *******/
    $scope.showModal  = false;
    $scope.titleTaken = false;
    $scope.visualizerForm = {};
    
    // Set modal title
    $scope.initTitleForm = function(){
	console.log("THIS", $rootScope.visualizer.title );
	$scope.visualizerForm.title = $rootScope.visualizer.title;
	console.log( "TITLE", $rootScope.visualizer.title , "\nSAVED TITLE:", $scope.visualizerForm.title );
    }
    

    $scope.openModal = function(){
	$scope.showModal = !$scope.showModal;
    }

    $scope.cancel = function(){
	$scope.showModal = false;
    }
    
    $scope.validTitle = function(){

	// get list of visualizers and maps that list into a 1D array that `include` can filter through
	$scope.titleTaken = include( $rootScope.userData.visualizers.map( function(obj){return obj.title; }), $scope.visualizerForm.title);
	console.log(  $rootScope.userData.visualizers.map( function(obj){return obj.title; }), $scope.visualizerForm.title,
		      include( $rootScope.userData.visualizers.map( function(obj){return obj.title; }), $scope.visualizerForm.title));
	
	if( !$scope.titleTaken ) $rootScope.visualizer.title = $scope.visualizerForm.title;
	return $scope.titleTaken;
    }
    
    $scope.$watch('titleTaken', function(newValue, oldValue){
	$scope.validTitle();
    });
    
    
    $scope.saveVisualizer = function(){	    
	
	// Must be signed in to save a visualizer
	if( $rootScope.userData == null ){	
	    console.log("Need an account to save visualizer.");	    
	    return;
	}
	
	// Title must be unique to user
	if( $scope.validTitle() ){
	    console.log( "Title taken");
	    return;
	} 
		
	var visualizerData = {
	    _id:      $rootScope.userData._id,
	    title:    $rootScope.visualizer.title,
	    settings: $rootScope.visualizer.settings 
	};
	
	// Save visualizer to server
	$http.post('/api/create_visualizer', visualizerData ).
	    success(function(data){

		console.log("Visualizer saved.");
		console.log(data);
		
		// Save data to rootScope
		$rootScope.visualizer = data;
		$rootScope.userData.visualizers.push({_id: data._id, title: $rootScope.visualizer.title});
		$rootScope.visualizer.saved = true;
		$scope.cancel();
		
	    }).error(function(data, status){
		console.log("unable to save visualizer")
	    });	
	
    };
    

    /******* COMMENTS *******/
    $scope.comment = "";
    $scope.charLimit = 500;
    
    $scope.$watch('comment', function(newValue, oldValue) {
	if( newValue.length > 500 ){
	    $scope.comment = $scope.comment.substring(0, 500);
	}
	
	$scope.charLimit = 500 - newValue.length;
    });
    
    $scope.saveComment = function(){
	if( $rootScope.userData == null ){	
	    console.log("Need an account to save visualizer.");	    
	    return;
	}

	if( $rootScope.visualizer._id == null ){	
	    console.log("Need save visualizer before you can create a comment.");	    
	    return;
	}
	
	var comment = {
	    _id:     $rootScope.userData._id,
	    vID:     $rootScope.visualizer._id,
	    color: $rootScope.userData.color,
	    comment: $scope.comment	    
	};
	
	$http.post('/api/create_comment', comment).
	    success( function(data){
		console.log(data);
		$rootScope.visualizer.comments = data
		
		var fakeCommentPush = {
		    name: $rootScope.userData.name,
		    comment: $scope.comment, 
		    color: $rootScope.userData.color
		}
		$rootScope.visualizer.comments.push( fakeCommentPush );
		$scope.comment = "";
		console.log( data);
	    }).
	    error( function(err, data){
		console.log(err);
		console.log(data);
		console.log("Bad things");
	    });
    }
    
    $scope.randColor = function(){
	return $rootScope.visualizer.settings.colors[Math.round( Math.random() * ($rootScope.visualizer.settings.colors.length-1))]
    }

    /******* VISUALIZER  *******/
    var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    particles = [],
    patriclesNum = 500,
    w = 1130, // works
    h = 500 ;
    //colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'];
    
    canvas.width = 1130; // Works
    canvas.height = 500;
    canvas.style.left = (window.innerWidth - 500)/2+'px';
    if(window.innerHeight>500)
	canvas.style.top = (window.innerHeight - 500)/2+'px';
    
    // Init each particle 
    function Factory(){  
	this.x =  Math.round( Math.random()  * w);
	this.y =  Math.round( Math.random()  * h);
	this.rad = Math.round( Math.random() * 1) + 1;
	
	this.vx = Math.round( Math.random() * ($rootScope.visualizer.settings.speed/2)) - $rootScope.visualizer.settings.speed;
	this.vy = Math.round( Math.random() * ($rootScope.visualizer.settings.speed/2)) - $rootScope.visualizer.settings.speed;	
	this.rgba = $rootScope.visualizer.settings.colors[ Math.round( Math.random() * ($rootScope.visualizer.settings.colors.length - 1)) ]; // Works 
	
    }
    
    // Draw/Update each particle
    function draw(){
	ctx.clearRect(0, 0, w, h);
	ctx.globalCompositeOperation = 'lighter';

	for(var i = 0;i < $rootScope.visualizer.settings.particleNum; i++){

	    var temp = particles[i];
	    var factor = 1;
	    
	    for(var j = 0; j < $rootScope.visualizer.settings.particleNum; j++){
		
		var temp2 = particles[j];
		ctx.linewidth = 0.5;
		
		if(temp.rgba == temp2.rgba && findDistance(temp, temp2)<50){
		    ctx.strokeStyle = temp.rgba;
		    ctx.beginPath();
		    ctx.moveTo(temp.x, temp.y);
		    ctx.lineTo(temp2.x, temp2.y);
		    ctx.stroke();
		    factor++;
		}
	    }
	    
	    ctx.fillStyle = temp.rgba;
	    ctx.strokeStyle = temp.rgba;
	    
	    ctx.beginPath();
	    ctx.arc(temp.x, temp.y, temp.rad*factor, 0, Math.PI*2, true);
	    ctx.fill();
	    ctx.closePath();
	    
	    ctx.beginPath();
	    ctx.arc(temp.x, temp.y, (temp.rad+5)*factor, 0, Math.PI*2, true);
	    ctx.stroke();
	    ctx.closePath();
	    

	    temp.x += temp.vx;
	    temp.y += temp.vy;
	    
	    if(temp.x > w)temp.x = 0;
	    if(temp.x < 0)temp.x = w;
	    if(temp.y > h)temp.y = 0;
	    if(temp.y < 0)temp.y = h;
	}
    }

    // Disctance function used to decide if a line should be drawn 
    function findDistance(p1,p2){  
	return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
    }

    // Request to draw frame
    window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
		window.setTimeout(callback, 1000 / 60);
            };
    })();

    (function init(){
	for(var i = 0; i < $rootScope.visualizer.settings.particleNum; i++){
	    particles.push(new Factory);
	}
	
    })();

    // draw loop
    (function loop(){
	draw();
	requestAnimFrame(loop);
    })();
    

    console.log($rootScope.visualizer.settings.particleNum);
}

function myPageCtrl($scope, $http, $location, $rootScope){
    
    // Make sure only users that are logged in can access page.
    $scope.myVisualizers = [];
    $scope.myComments    = [];
    // Password check flags
    $scope.hasNumeric   = false;
    $scope.hasLower     = false;
    $scope.hasUpper     = false;
    $scope.noWhiteSpace = false;
    $scope.userNameNoWhiteSpace   = false;    


    $scope.changePassword = false;
    $scope.changeColor    = true;
    $scope.changeSettings = false;
    $scope.showModal = false;
    
    $scope.loadVis = function(vis){
	
	$rootScope.visualizer = vis ;
	$rootScope.visualizer.saved = true;	

	$rootScope.fileName   = vis.name;
	$rootScope.visDat     = vis.settings;
	$rootScope.author     = vis.author;
	$rootScope._id        = vis._id;
	
	$location.path('/viewer');
    }


    $scope.$watch('changePassword', function(newValue, oldValue) {
	$scope.changeSettings = !$scope.changePassword;
    });
    
    $scope.$watch('changeColor', function(newValue, oldValue) {
	
	$scope.changeSettings = !$scope.changeColor;
    });


    $scope.openModal = function(){
	$scope.showModal = !$scope.showModal;
    }

    $scope.cancel = function(){
	$scope.showModal = false;
    }
    

    
    $scope.saveSettings = function(){
	
	$http.post('/api/update_account', $rootScope.userData).
	    success(function(data){
		console.log("Account updated");
	    });
	
    }
    
    $scope.deleteAccount = function(){
	console.log( "deleting account" );
	$http.post('/api/delete_account', $rootScope.userData).
	    success(function(data){
		
		$scope.showModal = false;
		console.log("Account deleted");
		$scope.showModal = false;
		
		$rootScope.visualizer = {} ;
		$rootScope.visualizer.settings = {} ;
		//$rootScope.userData = null;
		$rootScope.file     = null;
		$rootScope.fileName = null;    
		$scope.hasUserData  = false;
		
		$location.path('/home');
	    });
    }
    
    var REQUIRED_PATTERNS = [
	    /\d+/,    //numeric values
	    /[a-z]+/, //lowercase values
	    /[A-Z]+/, //uppercase values
	    /\W+/,    //special characters
	    /^\S+$/,   //no whitespace allowed
	    /\d+/
    ];
    
    $scope.validatePassword = function(password){
	
	// Sets form invalid state if needed
	
	
	
	// console.log(REQUIRED_PATTERNS.reduce( function( bool, regExp){ return bool && regExp.test( password );}));
	//if( $scope.userForm.password.$invalid ){ 
	$scope.hasNumeric   =  REQUIRED_PATTERNS[0].test(password); // needs one numeric value 
	$scope.hasLower     =  REQUIRED_PATTERNS[1].test(password); // needs one lowercase value
	$scope.hasUpper     =  REQUIRED_PATTERNS[2].test(password); // needs one uppercase value 
	$scope.hasSpecial   =  REQUIRED_PATTERNS[3].test(password); // needs one special char
	$scope.noWhiteSpace =  REQUIRED_PATTERNS[4].test(password); // can not have whitespace
	//}
	
	$scope.userForm.password.$invalid = !REQUIRED_PATTERNS.reduce(function(bool, reg){return bool && reg.test(password);});
        
	console.log('********************************');
	console.log('*Password:', password);
	console.log('*******');
	console.log("Numeric:",    $scope.hasNumeric);
	console.log("Lower:",      $scope.hasLower);
	console.log("Upper:",      $scope.hasUpper);
	console.log("WhiteSpace:", $scope.noWhiteSpace);
	console.log("Is invalid:",    $scope.userForm.password.$invalid);
	console.log('********************************');

	return $scope.userForm.password.$invalid;
    }

    // Check if password if valid    
    $scope.$watch('user.password', function(newValue, oldValue){
	$scope.validatePassword(newValue);
    });
    
    
    // Test to see if user name contains whitespace.
    // Sets form valid state when needed
    function validateUserName(name){
	$scope.userNameNoWhiteSpace   = !REQUIRED_PATTERNS[3].test(name);
	$scope.userForm.name.$invalid = !$scope.userNameNoWhiteSpace ;
	console.log( $scope.userNameNoWhiteSpace );
	return $scope.userForm.name.$invalid;
    }

    
    
    for( var i = 0 ; i < $rootScope.userData.comments.length ; i++){
	console.log("***********************************Comment",  $rootScope.userData.comments[i]);
	$http.post('/api/get_visualizer', {_id: $rootScope.userData.comments[i]}).
	    success(function(data){
		console.log("***********************************Comment", data);
		$scope.myComments.push(data);
	    });

    } ;    
                   
    $rootScope.userData.visualizers.forEach( function(vis){	
	$http.post('/api/get_visualizer', vis).
	    success(function(data){
		$scope.myVisualizers.push( data);
		console.log("Visualizer");
	    });
    });


    
	
    /*$scope.validPage = function(){
	if( $rootScope.userData == null ){
	    $location.path('/home');
	}
    } */
}

function registerCtrl($scope, $http, $location, $rootScope){
    

    console.log("test");   
    
    $scope.noSubmit  = false ;

    // Name check 
    $scope.nameTaken = false ;
    
    // Password check flags
    $scope.hasNumeric   = false;
    $scope.hasLower     = false;
    $scope.hasUpper     = false;
    $scope.noSpecial    = false; 
    $scope.noWhiteSpace = false;
    $scope.userNameNoWhiteSpace   = false;    
    var REQUIRED_PATTERNS = [
	    /\d+/,    //numeric values
	    /[a-z]+/, //lowercase values
	    /[A-Z]+/, //uppercase values
	    /\W+/,    //special characters
	    /^\S+$/,   //no whitespace allowed
	    /\d+/
    ];
    
    $scope.validatePassword = function(password){
	
	// Sets form invalid state if needed
	
	
	
	// console.log(REQUIRED_PATTERNS.reduce( function( bool, regExp){ return bool && regExp.test( password );}));
	//if( $scope.userForm.password.$invalid ){ 
	$scope.hasNumeric   =  REQUIRED_PATTERNS[0].test(password); // needs one numeric value 
	$scope.hasLower     =  REQUIRED_PATTERNS[1].test(password); // needs one lowercase value
	$scope.hasUpper     =  REQUIRED_PATTERNS[2].test(password); // needs one uppercase value 
	$scope.hasSpecial   =  REQUIRED_PATTERNS[3].test(password); // needs one special char
	$scope.noWhiteSpace =  REQUIRED_PATTERNS[4].test(password); // can not have whitespace
	//}
	
	$scope.userForm.password.$invalid = !REQUIRED_PATTERNS.reduce(function(bool, reg){return bool && reg.test(password);});
            
	console.log('********************************');
	console.log('*Password:', password);
	console.log('*******');
	console.log("Numeric:",    $scope.hasNumeric);
	console.log("Lower:",      $scope.hasLower);
	console.log("Upper:",      $scope.hasUpper);
	console.log("WhiteSpace:", $scope.noWhiteSpace);
	console.log("Is invalid:",    $scope.userForm.password.$invalid);
	console.log('********************************');

	return $scope.userForm.password.$invalid;
    }

    // Check if password if valid    
    $scope.$watch('user.password', function(newValue, oldValue){
	$scope.validatePassword(newValue);
    });
    
    
    // Test to see if user name contains whitespace.
    // Sets form valid state when needed
    function validateUserName(name){
	$scope.userNameNoWhiteSpace   = !REQUIRED_PATTERNS[3].test(name);
	$scope.userForm.name.$invalid = !$scope.userNameNoWhiteSpace ;
	console.log( $scope.userNameNoWhiteSpace );
	return $scope.userForm.name.$invalid;
    }
    
    $scope.initSignUp = function(){
	console.log( $scope );
	
	//update the DOM with newValue    
	// Check if user name is taken
	$scope.$watch('user.name', function(newValue, oldValue) {
	    validateUserName(newValue);
	    	    
	    if( !$scope.userNameNoWhiteSpace ){
		console.log( $scope.userNameNoWhiteSpace );
		return ;
	    }

	    if( newValue  === "" ){
		$scope.nameTaken = false;
	    }
	    
	    $http.get('/api/username_exists='+ newValue)
		.success(function(data){
		    $scope.nameTaken = true;
		    $scope.userForm.name.$invalid = true;
		    
		    // No name found == name has NOT been taken
		}).error(function(data, status){ 	    
		    console.log("Not taken");
		    $scope.nameTaken = false;
		    $scope.userForm.name.$invalid = false;
		});
	});
	
    };
    
    $scope.createAccount = function(userInfo){
	
	if( $scope.userForm.name.$invalid     ||
	    $scope.userForm.password.$invalid ||
	    $scope.userForm.passwordValidate.$invalid ){
	    
	    $scope.noSubmit = true ;
	    console.log( "Unable to create an account. Please fix highlighted issues.");
	    return null;
	}
	
	$scope.noSubmit = false ;
	
	$http.post('/api/create_account', userInfo).
	    success(function(data){
		
		console.log(data.name);
		$rootScope.userData = data;
		
		$location.path('/home');
		
	    }).error(function(data, status){
		$scope.nameTaken = true ;
	    });
	
    };
    
    // login for user with existing accounts
    $scope.logInAs = function(userInfo){
	$http.post('/api/login', userInfo).
	    success(function(data){
		
		console.log(data.name);
		
		// save data to rootScope
		$rootScope.userData = data;
		$location.path('/home');
		console.log( 'Should be home' );
		
	    }).error(function(data, status){
		
		$scope.userForm.name.$invalid     = true;
		$scope.userForm.password.$invalid = true;
		$scope.noSubmit                   = true;

		console.log(data);
		console.log(status);
	    });
    };
};

//No methods needed
function aboutCtrl($scope, $http, $location, $rootScope){
    //BLANK
}

//DO NOT TOUCH 
// inject methods
registerCtrl. $inject  =  ['$scope', '$http', '$location', '$rootScope'];
settingsCtrl. $inject  =  ['$scope', '$http', '$location', '$rootScope']; 
galleryCtrl.  $inject  =  ['$scope', '$http', '$location', '$rootScope'];
uploadCtrl.   $inject  =  ['$scope', '$http', '$location', '$rootScope'];
viewerCtrl.   $inject  =  ['$scope', '$http', '$location', '$rootScope', '$anchorScroll'];
myPageCtrl.   $inject  =  ['$scope', '$http', '$location', '$rootScope'];
aboutCtrl.    $inject  =  ['$scope', '$http', '$location', '$rootScope'];
homeCtrl.     $inject  =  ['$scope', '$http', '$location', '$rootScope', '$upload'];






