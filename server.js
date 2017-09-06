var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var upload = require('express-fileupload');

var config = require('./config');
var authenticate = require('./authenticate.js');

var index = require('./routes/index');
var users = require('./routes/users');
var noteRouter = require('./routes/noteRouter');
var pwordRouter = require('./routes/pwordRouter');
var cardRouter = require('./routes/cardRouter');

var app = express();

mongoose.connect(config.MONGO_DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to MongoDb server");
});

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
// uncomment after placing your favicon in /public

app.use(favicon(path.join(__dirname, 'public', 'favicon.svg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload());

app.use(passport.initialize());

//For Development only ---------------------------------------------------------------------------------
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.4:8100');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
//-----------------------------------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/notes', noteRouter);
app.use('/pwords', pwordRouter);
app.use('/cards', cardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    msg: err.message
  });
});

module.exports = app;