const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();


app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser(process.env.SECRET)); 

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
 
app.use(flash()); 


app.use(passport.initialize());

app.use(passport.session());

app.use((request, response, next) => {
    response.locals.h = { ...helpers };  

    response.locals.flashes = request.flash();

    response.locals.user = request.user;

    if (request.isAuthenticated()) {
        response.locals.h.menu = response.locals.h.menu.filter(i => i.logged);
    } else {
        response.locals.h.menu = response.locals.h.menu.filter(i => i.guest);
    }

    next();
});

const User = require('./models/User');
 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use('/', router);  

app.use(errorHandler.notFound);

app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports =  app;