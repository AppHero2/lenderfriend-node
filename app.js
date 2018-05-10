var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('https');

var index = require('./routes/index');
var users = require('./routes/users');

var firebase      = require('firebase');
var firebaseConfig = {
  apiKey: "AIzaSyD_5BizIuv6UQhXNNgnvUfjsdyOTDOvKU4",
  authDomain: "lenderfriend-fed55.firebaseapp.com",
  databaseURL: "https://lenderfriend-fed55.firebaseio.com",
  projectId: "lenderfriend-fed55",
  storageBucket: "lenderfriend-fed55.appspot.com",
  messagingSenderId: "693878406351"
};
firebase.initializeApp(firebaseConfig);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  // res.header("Access-Control-Allow-Credentials", true);
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function AppModule() {

  this.start = () => {
    var self = this;
  };

};

AppModule.startInstance = () => {
  var appModule = new AppModule();
  appModule.start();
  return appModule;
};

AppModule.startInstance();

module.exports = app;