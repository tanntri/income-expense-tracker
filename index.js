if (process.env.NODE_ENV !== "production") { // if in development, use environment variables from .env file
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const passport = require('passport'); // helps with authentication
const LocalStrategy = require('passport-local'); // helps with authentication
const methodOverride = require('method-override');
const session = require('express-session'); // allows us to use session
const flash = require('connect-flash'); // allows us to use flash message
const ExpressError = require('./utilities/ExpressError'); // use our own defined errors extended from default error
const MongoStore = require('connect-mongo');

const dashboardRoutes = require('./routes/dashboardRoutes'); // require route from dashboardRoutes.js
const authRoutes = require('./routes/authRoutes'); // require routes from authRoutes.js
const apiRoutes = require('./routes/apiRoutes'); // require routes from apiRoutes.js

const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/expense-tracker'

app = express();

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // connect the app with mongoose
db.on("error", console.error.bind(console, "connection error:")); // inform if there's an error connecting to database
db.once("open", () => {
    console.log('Database Connected'); // once database is connected, inform in console
});

app.engine('ejs', ejsMate) // use ejsmate (something like <% layout('layouts/boilerplate') %>) as an addition to ejs
app.set('views', path.join(__dirname, 'views')) // connect to views path

app.use(express.urlencoded({ extended: true })); // required to use req.body
app.use(methodOverride('_method')); // allows us to override POST method with PUT or DELETE
app.use(express.static(path.join(__dirname, 'public'))) // for static files

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

// session configuration
const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expiration time of session
        maxAge: 1000 * 60 * 60 * 24 * 7 // maximum age of session
    },
}
app.use(session(sessionConfig)); // use session with setting of sessionConfig
app.use(flash()) // use flash message

app.set('view engine', 'ejs'); // use ejs as view engine
app.set('views', path.join(__dirname, 'views')) // connect to views path

app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // use session to store passport authentication
passport.use(new LocalStrategy(User.authenticate())); // use authenticate() from passport-local-mongoose

passport.serializeUser(User.serializeUser()) // tell passport how to serialize user (store user in session)
passport.deserializeUser(User.deserializeUser()) // tell passport how to deserialize user (get user out of session)

// middleware to store variables in the locals
app.use((req, res, next) => {
    // res.locals.title;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})


app.use('/', authRoutes); // use routes defined in authRoutes
app.use('/user', dashboardRoutes); // use routes defined in dashboardRoutes
app.use('/api/user', apiRoutes); // use routes defined in apiRoutes

// render home page
app.get('/', (req, res) => {
    if (req.user) {
        res.redirect(`/user/${req.user._id}`)
    }
    res.render('home');
})

// for all requests, if reaches this, it means matches no route, which means doesn't exist
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404)) // use ExpressError to report 404 error
})

// middleware to render error reporting page
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; // use err.statuscode
    if (!err.message) err.message = 'Something Went Wrong' // if no error is defined, use this as a message
    res.status(statusCode).render('error', { err }); // render error message page
})

app.listen(process.env.PORT || 3000, () => {
    console.log('EXPENSE TRACKING APP ON PORT 3000');
})