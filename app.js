var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const request = require('request');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const OCP_CONF = JSON.parse(process.env.OCP_OAUTH_CONFIG);

app.use(session({
  secret: OCP_CONF.clientSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    maxAge: 3600 * 1000 // Extend session duration to an hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('openshift', new OAuth2Strategy({
    authorizationURL: OCP_CONF.authorization_endpoint,
    tokenURL: OCP_CONF.token_endpoint,
    clientID: OCP_CONF.clientID,
    clientSecret: OCP_CONF.clientSecret,
    callbackURL: 'http://localhost:3000/login/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    request({
      url: `${OCP_CONF.api_endpoint}/apis/user.openshift.io/v1/users/~`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (err, response, body) => {
      done(err, JSON.parse(body));
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
  });
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
  });

app.get('/login', passport.authenticate('openshift'));

app.get('/login/callback', passport.authenticate('openshift'), function(req, res, next) {
  res.redirect('/');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
