const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const app = express();


app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser(process.env.SECRET));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

app.use((request, response, next) => {
    response.locals.h = helpers;  

    response.locals.flashes = request.flash();

    next();
})

app.use('/', router);  

app.use(errorHandler.notFound);

app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports =  app;