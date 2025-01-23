const express = require('express');
const session = require('express-session');
const Keygrip = require('keygrip');
const path = require('path');
const app = express();
const cors = require('cors');

global.baseDir = __dirname;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Middleware for session
app.use(session({
    name: 'cookie',
    keys: new Keygrip(['cookie-is-secure', 'myNameIsBuguGuga'], 'SHA386', 'SHA16'),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
        priority: 'high',
        sameSite: true,
        httpOnly: true,
    },
    secret: 'cookie-is-secure',
    saveUninitialized: false,
    resave: false
}));


// Middleware for Json
app.use(express.json());

// Middleware for expressOption
const expressOption = {
    dotfiles: 'deny',
    index: false,
    // maxAge: '1d', // --> This is for production
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};


// Middleware for static files
app.use(express.static(path.join(__dirname, 'public'), expressOption));


// Setup view engine
const views = [
    path.join(__dirname, 'public/views'),
    path.join(__dirname, 'public/views/layout')
];
app.set("x-powered-by", false);
app.set('views', views);
// app.set("view cache", false); --> This is for production
app.set('view engine', 'pug');

// Middleware for router
require(path.join(__dirname, 'src/routes/routes'))(app);

// Middleware for error handling
app.use((error, req, res, next) => {
    const stackLines = error.stack.split('\n');
    const location = stackLines[2]?.trim();
    console.error('\x1b[31m%s\x1b[35m%s\x1b[0m', `[Error]: ${error.message}\n`, `Location ${error.stack}`);
    next('route');
    res.status(500).send('Internal Server Error');
});


// Middleware für URL-kodierte Daten
app.use(express.urlencoded({ extended: true }));

// Export the app to www
module.exports = app;