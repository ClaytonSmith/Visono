/*
 * Serve JSON to our AngularJS client
 */

function userExists(query, db){
    return db.users.find(query).count() != 0 ;
}

function visualizerExists(query, db){
    return db.visualizer.find(query).count() != 0 ;	
}

function  randomColor(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// RETURN COLLECTION
//  req.db.visualizer.find().toArray( function(err, item){
//	res.json(item);	
//    });
//
//

var mongoDB =  require('mongoskin').ObjectID();

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
		res.status(404).json({ error: "Username not found."}) ;	 
	    }
	    res.json({ success: "Username found."}) ;	 
	});
}

exports.info = function(req, res, next){
    console.log( "SHOWING INFO" );
    req.db.users.find().toArray( function(err, item){  
	res.json({
	    name: "Visono",
	});	    
    });
};

exports.createAccount = function(req, res, next){      
    console.log( req.body.name);
    // Check to see if username is taken
    req.db.users.findOne(
	{name: req.body.name},
	function(err, user){
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."}) ;	 
	    }
	    if(user){
		console.log( "User name already taken" );
		res.status(403).json({error: "Username already taken."}) ;	 
	    }
	    
	    // create user id 
	    var id   =   (new Date).getTime(); // = require('mongoskin').ObjectID();
	    
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
	    
	    console.log( "Created account" );
	    console.log( "Created account" );
	    // Add user to database
	    req.db.users.insert(userData, { w: 0 });
	    
	    
	    console.log( "Inserted" );
	    // send user back there user 
	    
	    
	    res.json( userData );	    	    
	});
} 



exports.login = function(req, res, next){

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

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
	    	return;
	    }
	    

	    
	    if( user.password === req.body.password ){
		res.send( user );
	    } else {
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
	    }
	});
}
	    
exports.changePassword = function(req, res, next){
    
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
		return;
	    }

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
	    	return;
	    }
	    
	    // Only get here if user exis
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
    // Check to see if username is exists
    if(!userExists({_id: req.body.uID}, req.db)){ 
	res.status(500).json({error: "Bad username or password."}) ;
	
    } else {
	
    // Get prospective users account 
    var col = req.db.users.find({ uID: req.body.uID})[0];
    
	// Check password
	if( col.password == req.body.password ){
	
	// If passwords match, change to new password
	} else {
	res.status(403).json({error: "Bad username or password"});
	}
	}*/

// implement when visono is finished 

exports.changeAvitar = function(req, res, next){

    if(!userExists({_id: req.body.uID}, req.db)){ 
	res.status(500).json({error: "Bad username or password."}) ;
	
    } else {
	req.db.users.update({ _id: uID}, { $set: { "avitar" : req.body.newAvitar }});
    	res.json({status: "Avitar Changed" });
    }
}

exports.deleteAccount = function(req, res, next){

    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
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
			
			// Remove comment links to users visualizer
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
	    
	    ;
	    
	    res.json({status: "Account deleted"});
	});
}

exports.deleteVisualizer = function(req, res, next){

   req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
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
			    {$pull: { "visualizers": { _id: viseo._id }}},
			    {multi: false}
			);
		    }
		});
	});
}

exports.createVisualizer = function(req, res, next){

    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
	   	return;
	    }  
	    
	    var id   = (new Date).getTime();
	    
	    // Save file somewhere
	    var visualizerData = {
		_id: id,      
		"fileName"     : "someID.text",
		"title"        : req.body.title,
		"author"       : user.name,
		"owner"        : user._id,
		"creationDate" : new Date(),
		"settings"     : req.body.settings,
		"comments"     : [],
		"rating"       : 0
	    } ;
	    
	    // Save data to database
	    req.db.visualizer.insert(visualizerData, { w: 0 });
	    
	    // Add visualizer to user's list 
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

exports.getVisualizers = function(req, res, next){
    req.db.visualizer.find().toArray( function(err, item){  
	res.json(item);	    
    });
}

exports.getVisualizer = function(req, res, next){
    req.db.visualizer.findOne(
	{_id: req.body._id},
	function(err, visualizer){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    
	    // User does now exist
	    if(!visualizer){

		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
		return ;
	    }
	    
	    
	    res.json(visualizer);	    
	})
}

// Old code
// get visualizer from user comment req.db.visualizer.find({_id: req.db.users.find({ THIS: THING})[0].comments[0].id})


exports.createComment = function(req, res, next){

   req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    
	    // User does now exist
	    if(!user){

		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
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
		    if(!visualizer){

			console.log( req.body );
			console.log( visualizer );
			console.log( "User name does not exist" );
			res.status(404).json({error: "Username or passward may be incorrect."}) ;	
			return ;
		    }	    
		    
		    var commentData  = {
			"name"     : user.name,
			"_id"      : user._id,
			"date"     : (new Date).getTime(),
			"comment"  : req.body.comment,
			"color"    : user.color
 		    }
		    
		    // Adds link to user comment on users account
		    req.db.users.update(
			{_id: user._id }, // Look for single user
			{$push: { comments: visualizer._id }}, //push vID
		    	function (err, result) {
			    if (err) throw err;
			    console.log("Visualizer created.");
			    console.log(result);
			}
			
		    );
		    
		    // Adds comment data to visualizer 
		    req.db.visualizer.update(
			{_id: visualizer._id },
			{$push: { comments: commentData }},
			function (err, result) {
			    if (err) throw err;
			    console.log("Visualizer created.");
			    console.log(result);
			}
			
		    ); 
		});
	});
    
    req.db.visualizer.findOne(
	{_id: req.body.vID},
	function(err, visualizer){
	    
	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }
	    if(!visualizer){
		
		console.log( req.body );
		console.log( visualizer );
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
		return ;
	    }	    
	    
	    
	    res.json( visualizer.comments );
	});
}


/* Serverside stuff
*/


exports.updateAccount = function(req, res, next){

    
    req.db.users.findOne(
	{_id: req.body._id},
	function(err, user){

	    // Server error 
	    if(err){
		console.log( "Server error" );
		res.status(500).json({error: "Server error."});
	    }

	    // User does now exist
	    if(!user){
		console.log( "User name does not exist" );
		res.status(404).json({error: "Username or passward may be incorrect."}) ;	
		return;
	    }


	    // updates color
	    req.db.visualizer.update(
		{"comments._id": user._id },
		{"$set": { "comments.$.color"  : req.body.color}},
		{multi: true},
		function (err, inserted) {
                    // check err...
	    console.log(err);
	    console.log(inserted);

		});

	    
	    req.db.users.update(
		{_id: user._id },
		{"$set": { "color"  : req.body.color}},
		{multi: true},
		function (err, inserted) {
                    // check err...
	    console.log(err);
	    console.log(inserted);

		});

	    
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
    	    
	    
	    
	    // Remove the comments left by user
	    
    });
}
