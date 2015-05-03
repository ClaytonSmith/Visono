
/***
 * Project: Visono
 * File: routs/api.js
 * 
 * Authors: Clayton Smith / Mark McGrotty / Shaun Confrey
 *
 *  Copyright (c) 2015 by Visono development team
 *      All rights reserved. May be freely copied or excerpted for
 *      any purpouse with credit to the author.
 ***/


/*
 * API for client
 */


// Helper: Returns true if user exists in the database
function userExists(query, db){
    return db.users.find(query).count() != 0 ;
}

// Helper Returns true if visualizer exists in the database
function visualizerExists(query, db){
    return db.visualizer.find(query).count() != 0 ;	
}

// Selects a random Hex color
function  randomColor(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// MongoDB-MongoSkin helper object. Grants access to mongoSkin middle-ware
var mongoDB =  require('mongoskin').ObjectID();


// API: tests if user exists
exports.userExists = function(req, res, next){

    console.log( req.params.name );
    req.db.users.findOne(
	{name: req.params.name},
	function(err, user){
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."}) ;	 
	    }
	    if(!user){
		console.log( "User not found" );
		res.status(404).json({ error: "User name not found."}) ;	 
	    }
	    res.json({ success: "User name found."}) ;	 
	});
}

// API: returns basic info about Visono
// Used only for testing
// returns a list of users
exports.info = function(req, res, next){
    req.db.users.find().toArray( function(err, item){  
	res.json({
	    name: "Visono",
	    users: item
	});	    
    });
};

// API: Creates user account 
// DATA NEEDED: unique user name and password
// User data object is returned when account is created
exports.createAccount = function(req, res, next){      
    console.log( req.body.name);
    
    // Check if user name is taken
    req.db.users.findOne(
	{name: req.body.name},
	function(err, user){
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."}) ;	 
	    }

	    // User name is taken
	    if(user){
		console.log( "User name already taken" );
		res.status(403).json({error: "User name already taken."}) ;	 
	    }
	    
	    // create user id
	    var id   =   (new Date).getTime();
	    
	    // User data object
	    var userData = {
		_id: id,
		"name"     : req.body.name,
		"password" : req.body.password,
		"joinDate" : new Date(),
		"color"    : randomColor(),
		"visualizers"   : [],
		"ratings"  : [],
		"comments" : [],
		"votes"    : {}
	    }
	    
	    // Add user to database
	    req.db.users.insert(userData, { w: 0 });
	    console.log( userData.name + " has created an account." );
	    
	    // Send user their data
	    res.json( userData );	    	    
	});
} 


// API: Log in
// DATA NEEDED: user name, password
// If user exists and the provided password matches, the user data will be sent to the client
exports.login = function(req, res, next){
    
    // Find user
    req.db.users.findOne(
	{name: req.body.name},
	function(err, user){
	    console.log( user,
			 req.body.password,
			 user.password );
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
		return;
	    }


	    if(!user || // User does not exist in the database
	       !req.body.password || !req.body.name){ // user name or password not provided
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
	    	return;
	    }
	    
	    if( user.password === req.body.password ){
		res.send( user );
	    } else {
		// If password does not match 
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
	    }
	});
}

//API: Allows users to change their password
// DATA NEEDED: uID, new password 
exports.changePassword = function(req, res, next){
    
    // Find user by uID
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
		return;
	    }

	    // User does not exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
	    	return;
	    }
	    
	    // Check password
	    if( user.password == req.body.password ){
		console.log( "Password changed for user: " + user.name );
		req.db.users.update({ _id: uID}, { $set: { "password" : req.body.newPassword }});
		res.json({status: "Password Changed" });
		
            // Password does not match
	    } else {
		res.status(403).json({error: "Bad password"});
	    }
	    
	});
}

/*
    // Check to see if user name is exists
    if(!userExists({_id: req.body.uID}, req.db)){ 
	res.status(500).json({error: "Bad user name or password."}) ;
	
    } else {
	
    // Get prospective users account 
    var col = req.db.users.find({ uID: req.body.uID})[0];
    
	// Check password
	if( col.password == req.body.password ){
	
	// If passwords match, change to new password
	} else {
	res.status(403).json({error: "Bad user name or password"});
	}
	}*/


// implement when visono is finished 
exports.changeAvatar = function(req, res, next){

    if(!userExists({_id: req.body.uID}, req.db)){ 
	res.status(500).json({error: "Bad user name or password."}) ;
	
    } else {
	req.db.users.update({ _id: uID}, { $set: { "avatar" : req.body.newAvitar }});
    	res.json({status: "Avatar Changed" });
    }
}

// API: method to delete user account from Visono
// DATA NEEDED: uID
exports.deleteAccount = function(req, res, next){

    // Find user by uID
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does not exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
		return;
	    }

	    // For each of the user's visualizers
	    user.visualizers.forEach(function(visualizer){
		req.db.visualizer.findOne(
		    {_id: visualizer._id},
		    function(err, vid){

			// Server error 
			if(err){
			    console.log( "Server error" );
			    res.status(500).json({error: "Server error."});
			}

			// User does now exist
			if(!vid){	
			    console.log( "User name does not exist" );
			    // DO NOT RESPOND HERE
			    return;
			}
			
			// Remove comment left by other users
			// Remove comment links in other users account
			req.db.users.update(
			    {comments: vid._id},               //looks for users with vID
			    {$pull: {comments: vid._id}},      //Remove vID
			    {multi: true},
			    function (err, inserted) {
				// check err...
				console.log(err);
				console.log(inserted);
			    });
			
			// Remove user's visualizers 
			req.db.visualizer.remove(
			    {"_id": vid._id},
			    function (err, inserted) {
				// check err...
				console.log(err);
				console.log(inserted);	
			    });
		    });
	    });
	    
	    // Remove the comments left by user
	    // Removes comments user left on other visualizers
	    req.db.visualizer.update(
		{"comments._id": user._id },
		{$pull: { "comments": {_id  : user._id}}},
		{multi: true},
		function (err, inserted) {
		    // check err...
		    console.log(err);
		    console.log(inserted);
		    
		});
	    
	    // Remove user
	    req.db.users.remove({ _id: user._id},
				function (err, inserted) {
				    // check err...
				    console.log(err);
				    console.log(inserted);
				    
				});

	    // There should be no trace of the user left 	    
	    res.json({status: "Account deleted"});
	});
}


// API: Used to delete visualizer
// DATA NEEDED: uID, vID
exports.deleteVisualizer = function(req, res, next){

    // Get user
   req.db.users.findOne(
       {_id: req.body._id},
	function(err, user){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does not exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
	    	return;
	    }
	    
	    // Get visualizer 
	    req.db.visualizer.findOne(
		{_id: req.body.vID},
		function(err, visualizer){
		    
		    // Server error 
		    if(err){
			console.log( "Server error" );
			res.status(500).json({error: "Server error."});
		    }
		    
		    // User does now exist
		    if(!visualizer){
			console.log( "Visualizer does not exist" );
			res.status(404).json({error: "correct."}) ;	
		    	return;
		    }

		    // Make sure user is the owner of the visualizer
		    if( visualizer.owner != user._id ){
			res.status(403).json({error: "Permission denied"}) ;	
		    } else {
			
			req.db.users.update(
			    {comments: visualizer._id}, //looks for users with vID
			    {$pull: {comments: visualizer._id}}, //Remove vID
			    {multi: true}
			);
			
			// Remove user's visualizers 
			req.db.visualizer.remove({"_id": visualizer._id});
			
			// Remove link to visualizer from user's personal collection
			req.db.users.update(
			    {_id: user._id},
			    {$pull: { "visualizers": { _id: visualizer._id }}},
			    {multi: false}
			);
		    }
		});
	});
}

// API: Used to create visualizer
// DATA NEEDED: uID, visualizer settings object
exports.createVisualizer = function(req, res, next){

    // Get user
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does not exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
	   	return;
	    }  
	    
	    // Create unique uID
	    var id   = (new Date).getTime();
	    
	    // Save file somewhere
	    var visualizerData = {
		_id: id,      
		"fileName"     : "someID.text",      // Name of file saved to server. Implemented after visualizer fixed
		"title"        : req.body.title,     // Title set by user
		"author"       : user.name,          // Author name
		"owner"        : user._id,           // Owner ID
		"creationDate" : new Date(),         // Creation date
		"settings"     : req.body.settings,  // Visualizer settings 
		"comments"     : [],                 // Comments left by users. 
		"rating"       : 0                   // Rating system not yet implemented
	    } ;
	    
	    // Save data to database
	    req.db.visualizer.insert(visualizerData, { w: 0 });
	    
	    // Add visualizer to user's list of visualizers 
	    req.db.users.update(
		{_id: user._id },
		{$push: { visualizers: {
		    _id: id,
		    title: req.body.title
		}}},		
		function (err, result) {
		    if (err) throw err;
		    console.log("Visualizer created.");
		    console.log(result);
		}
	    );
	    
	    // Send user the data about their visualizer
	    res.json( visualizerData );
	});
}

// API: returns a list of all visualizers in Visono's database
// DATA NEEDED: None
exports.getVisualizers = function(req, res, next){
    req.db.visualizer.find().toArray( function(err, item){  
	res.json(item);	    
    });
}

// API: Returns a specific visualizer
// DATA NEEDED: vID
exports.getVisualizer = function(req, res, next){
    req.db.visualizer.findOne(
	{_id: req.body._id},
	function(err, visualizer){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    
	    // visualizer does not exist
	    if(!visualizer){

		console.log( "Visualizer does not exist" );
		res.status(404).json({error: "Visualizer does not exist."}) ;	
		return ;
	    }
	    
	    // Ret visualizer
	    res.json(visualizer);	    
	})
}

// Old code
// get visualizer from user comment req.db.visualizer.find({_id: req.db.users.find({ THIS: THING})[0].comments[0].id})



// API: Allow users to leave comments on visualizers 
// DATA NEEDED: uID, vID, comment
exports.createComment = function(req, res, next){

   req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    
	    // User does not exist
	    if(!user){

		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
		return ;
	    }
	    
	    // Get visualizer 
	    req.db.visualizer.findOne(
		{_id: req.body.vID},
		function(err, visualizer){
		    
		    // Server error 
		    if(err){
			console.log( "Server error" );
			res.status(500).json({error: "Server error."});
		    }

		    // Visualizer does not exist 
		    if(!visualizer){
			console.log( req.body );
			console.log( visualizer );
			console.log( "Visualizer does not exist" );
			res.status(404).json({error: "Visualizer does not exist."}) ;	
			return ;
		    }	    
		    
		    // Comment data object
		    var commentData  = {
			"name"     : user.name,             // Name of of user leaving the comment 
			"_id"      : user._id,              // ID of user leaving the comment
			"date"     : (new Date).getTime(),  // Date comment was made
			"comment"  : req.body.comment,      // Comment body
			"color"    : user.color             // User color 
 		    }
		    
		    // Adds link to user comment on users account
		    req.db.users.update(
			{_id: user._id }, // Look for single user
			{$push: { comments: visualizer._id }}, //push vID
		    	function (err, result) {
			    if (err) throw err;
			    console.log("Comment created on user account.");
			    console.log(result); // used for testing
			});

		    // Adds comment data to visualizer 
		    req.db.visualizer.update(
			{_id: visualizer._id },
			{$push: { comments: commentData }},
			function (err, result) {
			    if (err) throw err;
			    console.log("Comment left on visualizer.");
			    console.log(result); // used for testing 
			}); 
		});
	});
    
    // Get the new visualizer data object and send to client
    req.db.visualizer.findOne(
	{_id: req.body.vID},
	function(err, visualizer){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    
	    res.json( visualizer.comments );
	});
}


// API: Allow users to change details about their account
// DATA NEEDED: uID
exports.updateAccount = function(req, res, next){

    // Get user data object
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does not exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "User name or password may be incorrect."}) ;	
		return;
	    }

	    // Update user data
	    req.db.users.update(
		{_id: user._id },                       // FIND by uID
		{"$set": { "color"  : req.body.color}}, // Set user color
		{multi: true},            
		function (err, inserted) {
                    // check err...
		    console.log(err);
		    console.log(inserted);
		});	    

	    // updates color
	    req.db.visualizer.update(
		{"comments._id": user._id },               // Find visualizers with comments a specific uID       
		{"$set": 
		 { "comments.$.color"  : req.body.color}}, //  Change the color of those comments 
		{multi: true},
		function (err, inserted) {
                    // check err...
		    console.log(err);
		    console.log(inserted); 
		});
	    
	    // update user password
	    req.db.users.update(            
		{_id: user._id },
		{"$set": { "password"  : req.body.password}},
		{multi: true},
		function (err, inserted) {
		    // check err...
		    console.log(err);
		    console.log(inserted);
		});
	    
	    res.json( req.body );	    
    });
}
