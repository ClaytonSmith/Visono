////TODO 
// Add:
//   Abbility to:
//     | change password
//     | delete account
//     | delete visualizer
//     - add ranking 
// implement visExists

// *Exists takes a {KEY: VALUE} object to search for




function userExists(query){
    if(db.users.find(query).count() != 0 ) 
	return true;
    else 
	return false;
}

function videoExists(query){
    if(db.video.find(query).count() != 0 ) 
	return true;
    else 
	return false;
}




function createUser(name, pswrd, avatar){
    if(userExists({name: name})) return false ;
    
    var id       = ObjectId();
    var userData = {
	_id: id,
	"name"     : name,
        "password" : pswrd,
        "joinDate" : new Date(),
        "avitar"   : avatar,
        "videos"   : [],
        "ratings"  : [],
	"comments" : []
    }
    
    // Add user to database
    db.users.insert(userData);
    
    return id;
}

function changePassword(uID, newPswrd){
    if(!userExists({_id: uID})) return false ;
    
    db.users.update({ _id: uID}, { $set: { "password" : newPswrd }});
}

function changeAvitar(uID, newAvitar){
    if(!userExists({_id: uID})) return false ;

    // remove old photo 
    db.users.update({ _id: uID}, { $set: { "avitar" : newAvitar }});
}

function deleteUser(uID){
    if(!userExists({_id: uID})) return false ;
    
    var col = db.users.find({_id: uID})[0];

    // For each of the user's visualizers
    col.videos.forEach(function(video){
	if(!videoExists({_id: video._id})) return ;
	var videoCol = db.video.find({_id: video._id})[0];
	
	// remove comment links to users video
	db.users.update(
	    {comments: videoCol._id}, //looks for users with vID
	    {$pull: {comments: videoCol._id}}, //Remove vID
	    {multi: true}
	);
	
	// Remove user's visualizers 
	db.video.remove({"_id": videoCol._id});
    });
    
    printjson( db.video.find(
	{ "comments._id": col._id})[0]);
    
    // Remove the comments left by user
    db.video.update(
	{"comments._id": col._id },
	{$pull: { "comments": { "_id"  : col._id}}},
	{multi: true});
    
    // Remove user
    db.users.remove({ _id: col._id});
}
function deleteVideo( uID, vID){
    if(!userExists({_id: uID})) return false ;
    if(!videoExists( {_id: vID})) return false ;

    var uCol  = db.users.find({_id: uID})[0];
    var vCol  = db.video.find(  {_id: vID})[0];
    //Working on this now

    db.users.update(
	{comments: vCol._id}, //looks for users with vID
	{$pull: {comments: vCol._id}}, //Remove vID
	{multi: true}
    );
    
    // Remove user's visualizers 
    db.video.remove({"_id": videoCol._id});
    
    // Remove link to visualizer from user's personal collection
    db.users.update(
	{_id: uCol._id},
	{$pull: { "videos": { _id: vCol._id }}},
	{multi: false}
    );
}

function createVideo( uID, videoName, settings){
    if(!userExists({_id: uID})) return false ;
    
    var col  = db.users.find({_id: uID})[0];
    var id   = ObjectId();

    // Save file somewhere
    
    var videoData = {
	_id: id,      
        "fileName" : "someID.ext",
        "name"     : videoName,
        "owner"    : col._id,
        "settings" : settings,
        "comments" : []
    } ;

    db.video.insert(videoData);
    
    // Add visualizer to user's list 
    db.users.update(
	{_id: col._id },
	{$push: { videos: {
	    _id: id,
	    name: videoName
	}}}
    );

    return id;
}


// get video from user comment db.video.find({_id: db.users.find({ THIS: THING})[0].comments[0].id})
function addComment(uID, vID, comment){
    if(!userExists( {_id: uID})) return false ;
    if(!videoExists({_id: vID})) return false ;

    var userCol    = db.users.find({_id: uID})[0];
    var videoCol   = db.video.find({_id: vID})[0];
    var videoData  = {
	"user"     : userCol.name,
	"_id"      : userCol._id,
	"date"     : (new Date).getTime(),
	"comment"  : comment
    }
    
    // Adds link to user comment on users account
    db.users.update(
	{_id: userCol._id }, // Look for single user
	{$push: { comments: videoCol._id }} //push vID
    );

    // Adds comment data to visualizer 
    db.video.update(
	{_id: videoCol._id },
	{$push: { comments: videoData }}
    );  
}
