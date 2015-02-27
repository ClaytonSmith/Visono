/**
 * File: app.js
 * Written By: Clayton Smith
 * Project name: Visono
 **
 *
 */

var express = require('express'),
    routes  = require('./routes'),
    api     = require('./routes/api'),
    http    = require('http'),
    path    = require('path');


var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
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

// JSON API
app.get('/api/name', api.name);

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
