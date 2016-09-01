'use strict';

var http = require("http");
const express = require('express');
const mongoose = require('mongoose');
var port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
var ipfilter = require('express-ipfilter');



/**
 * Initiate necessary libraries.
 */
const config = require('./config');
const Botkit = require('botkit/lib/Botkit.js');
const controller = Botkit.slackbot({
    debug: false
});
const ManagerModel = require('./models/manager');
console.log("config get: " + config.get('MESSAGE'));

const Controller = require('./controllers/controller.js');

/**
 * Connect to MongoDB.
 */
 var mongoURI = process.env.MONGODB_URI || config.get('db-connection-string');

mongoose.connect(mongoURI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  console.error('connect to mongo on: ' +  mongoURI);
  //process.exit(1);
})

/**
 * Instantiate slack bot.
 */
new ManagerModel(controller);

/**
 * Spawn controller and connect to Slack server.
 */

controller
    .spawn({
        token: config.get('token')
    })
    .startRTM((err, bot, payload) => {
        if (err) {
        	return console.error('Error: ', err);
        }
    });

const app = express();
app.set('port', port);
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Whitelist the following IPs 
//var ips = ['127.0.0.1'];
//app.use(ipfilter(ips, {mode: 'allow', allowForward: 'true'}));

//ROUTES
app.get('/', Controller.getHome);
app.post('/question', Controller.postQuestion);
app.get('/question/delete/:questionID', Controller.deleteQuestion); 

app.post('/email', Controller.postEmail);
app.get('/email/delete/:emailID', Controller.deleteEmail);

app.get('/results', Controller.getResults); 

/**
 * Start Express server.
 */

app.listen(process.env.PORT || app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});