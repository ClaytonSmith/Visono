/**
 * File: app.js
 * Written By: Clayton Smith
 * Project name: Visono
 **
 * http://pastebin.com/12wzWV3e
 */



var express = require('express'),
    routes  = require('./routes'),
    api     = require('./routes/api'),
    http    = require('http'),
    path    = require('path');

var mongo   = require('mongoskin');
var db      = mongo.db("mongodb://localhost:27017/visono", {native_parser:true});
db.bind('visualizer');
db.bind('users');

var app = module.exports = express();

app.use(function(req, res, next) {
    req.db = db;
    //    req.db.users = db.collection('users');
    //    req.db.video = db.collection('video');
    next();
})

// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());





//app.use(express.cookieParser());
//app.use(express.session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
//app.use(express.csrf());


app.use(express.static(path.join(__dirname, 'public')));


//app.use(function(req, res, next) {
 // res.locals._csrf = req.session._csrf;
//  return next();/
//})

app.use(app.router);

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 

// Routes
app.get('/partials/:name', routes.partial );

app.get('/api/username_exists?=:name', api.userExists);

// JSON API
app.get('/api/info',               api.info);


app.post('/api/login',              api.login);

//app.get('/api/get_users',          api.getUsers);
app.get('/api/get_visualizers',    api.getVisualizers);
app.post('/api/get_visualizer',    api.getVisualizer);
app.post('/api/create_account',    api.createAccount);
app.post('/api/update_account',    api.updateAccount);


app.post('/api/delete_account',    api.deleteAccount);
app.post('/api/create_visualizer', api.createVisualizer);
app.post('/api/delete_visualizer', api.deleteVisualizer);
app.post('/api/create_comment',    api.createComment);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index );


app.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/index.html"); 
});

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
