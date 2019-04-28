require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const colors = require('colors/safe');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const upload = require('express-fileupload');

const config = require('./config');
const authenticate = require('./authenticate.js');

const index = require('./routes/index');
const users = require('./routes/users');
const noteRouter = require('./routes/noteRouter');
const pwordRouter = require('./routes/pwordRouter');
const cardRouter = require('./routes/cardRouter');

const app = express();

//Secure traffic
// app.all('*', function (req, res, next) {
//   console.log('Incoming Req: Method: ' + req.method + ' Secure: ' + req.secure + ' Hostname: ' + req.hostname + ' Url: ' + req.url);
//   if (req.secure) {
//     return next();
//   }
//   console.log('Redirecting to : ' + 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   //If 307 is not added to redirect, it will convert all requests to GET type automatically
//   //307 --> Temporary Redirect HTTP Code
// });

mongoose.Promise = Promise;
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useMongoClient: true,
  auth: {
    authSource: process.env.DB_AUTH_SOURCE,
    user: process.env.DB_USER,
    password: process.env.DB_PWD
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, '\nconnection error:'));
db.once('open', () => console.log(colors.green("\nConnected to mongoDb server")));
// view engine setup
app.set('views', path.join(__dirname, 'public/views'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.svg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload());

app.use(passport.initialize());

//For Development only ---------------------------------------------------------------------------------
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//-----------------------------------------------------------------------------------------------------

// Serve static content
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
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

// Common Error Handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  console.error('\nError:', err, '\n');
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    status: err.status
  });
});

module.exports = app;