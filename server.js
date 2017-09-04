// v 0.0.1

/*

 Grand Bazaar Game Server 

 Info:
 This servers has the following modules:
 
 Copyright (c) Bedbug 2017
 Author: Aris Brink

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var express = require("express"),
    http = require('http'),
    bodyParser = require('body-parser'),
    redis = require('redis'),
    mongoose = require('mongoose'),
    winston = require('winston'),
    morgan = require('morgan'),
    path = require('path'),
    fs = require('fs'),
    junk = require('junk');



var app = module.exports = exports.app = express();
var version = "0.0.1";
// Create Server
var server = http.createServer(app);
var port = (process.env.PORT || 3030)

var io = require('socket.io')(server);

app.listen(port, function () {
    console.log("------------------------------------------------------------------------------------");
    console.log("-------       Grand Bazaar Game Server %s listening on port %d        --------", version, port);
    console.log("-------       Environment: " + process.env.NODE_ENV);
    console.log("------------------------------------------------------------------------------------");
});

if(process.env.NODE_ENV == "development"){
morgan.token("date-time", function (req, res) { return (new Date()).toISOString() });
app.use(morgan(':date-time :method :url :status :response-time ms - :res[content-length]'));
app.use(morgan('dev'));
}
app.get("/crossdomain.xml", onCrossDomainHandler);

function onCrossDomainHandler(req, res) {
    var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM' +
        ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
    xml += '<allow-access-from domain="*" to-ports="*"/>\n';
    xml += '</cross-domain-policy>\n';

    req.setEncoding('utf8');
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(xml);
}



// var redisCreds = require('./config/redisConfig');
var mongoCreds = require('./config/mongoConfig');

// var PublishChannel = null;
// var SubscribeChannel = null;

// try {
//     PublishChannel = redis.createClient(process.env.REDIS_URL || "redis://h:p24268cafef1f0923a94420b8cb29eb88476356728a9825543a262bac20b0c973@ec2-34-249-251-118.eu-west-1.compute.amazonaws.com:25229");
        
//     SubscribeChannel = redis.createClient(process.env.REDIS_URL || "redis://h:p24268cafef1f0923a94420b8cb29eb88476356728a9825543a262bac20b0c973@ec2-34-249-251-118.eu-west-1.compute.amazonaws.com:25229");

//     PublishChannel.on("error", function (err) {
//         console.error(err);
//         console.error(err.stack);
//     });

//     SubscribeChannel.on("error", function (err) {
//         console.error(err);
//         console.error(err.stack);
//     });
// }
// catch (err) {
//     console.log(err);
// }

// app.PublishChannel = PublishChannel;

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development";

var mongoConnection = 'mongodb://' + mongoCreds[process.env.NODE_ENV].user + ':' + mongoCreds[process.env.NODE_ENV].password + '@' + mongoCreds[process.env.NODE_ENV].url;

mongoose.Promise = global.Promise;

mongoose.connect(mongoConnection, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + mongoConnection + '. ' + err);
    }

});

function log(info) {
    //  console.log("[" + Date.now() + "] API CALL: " + info);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

app.get('/', function (req, res, next) {
    res.send(200, "Grand Bazaar main game server status is live.");
});

/*  Winston Logger Configuration */
var logger = new (winston.Logger)({
    levels: {
        prompt: 6,
        debug: 5,
        info: 4,
        core: 3,
        warn: 1,
        error: 0
    },
    colors: {
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        core: 'magenta',
        warn: 'yellow',
        error: 'red'
    }
});

logger.add(winston.transports.Console, {
    timestamp: true,
    level: process.env.LOG_LEVEL || 'debug',
    prettyPrint: true,
    colorize: 'level'
});

if (process.env.NODE_ENV == "production") {
    logger.add(winston.transports.File, {
        prettyPrint: true,
        level: 'core',
        silent: false,
        colorize: false,
        timestamp: true,
        filename: 'debug.log',
        maxsize: 40000,
        maxFiles: 10,
        json: false
    });
}

// Central Error Handling for all Express router endpoints: for Express this should be the last middleware declared:
// See http://expressjs.com/en/guide/error-handling.html
app.use(function (error, request, response, next) {
    logger.error('Error: %s \nStack: %s', error.message, error.stack);

    // In Development environment return the exact error message and stack:
    return response.status(500).json({
        error: {
            message: error.message,
            stack: error.stack
        }
    });

    // In Production environment, return a generic error message:
    //return response.status(500).json({error: 'Oops! The service is experiencing some unexpected issues. Please try again later.'});
});

// Bootstrap models
var modelsPath = path.join(__dirname, 'components/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if(junk.not(file))
    require(modelsPath + '/' + file);
});

// var routesPath = path.join(__dirname, 'components/routes');
// fs.readdirSync(routesPath).forEach(function (file) {
//     if(junk.not(file))
//     app.use('/', require(routesPath + '/' + file));
// });

// Bootstrap api
var apiPath = path.join(__dirname, 'components/api');
fs.readdirSync(apiPath).forEach(function (file) {
    if(junk.not(file))
    app.use('/', require(apiPath + '/' + file));
});

app.set('views', __dirname + './components/views')
app.set('view engine', 'ejs');

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

//
// Now that we are set, let the games begin.
//