var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();
//记录访问日志
var log = log4js.getLogger("app");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var session = require('express-session')({
    secret: 'wenxiu',
    name: 'wx:',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000 //cookie7天过期
    }
});
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', index);
app.use('/users', users);
api(app)

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
    log.error("Something went wrong:", err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
