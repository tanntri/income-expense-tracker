const express = require('express');
const passport = require('passport'); // helps with authentication
const catchAsync = require('../utilities/catchAsync');
const router = express.Router(); // use router
const auth = require('../controllers/authControllers');

// route to register
router.route('/register')
    .get(auth.renderRegisterForm) // get route of register to render register form
    .post(catchAsync(auth.registerUser)); // post route of register to create new user

// route to login
router.route('/login')
    .get(auth.renderLoginForm) // get route of login to render login form
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(auth.loginUser)); // post route of login to authenticate user

// get route of logout to log user out of session
router.get('/logout', auth.logoutUser);

// export router in order to use in index.js
module.exports = router;