const User = require('../models/user'); // require user model

//**************************************** */
// function to render register form
//**************************************** */
module.exports.renderRegisterForm = (req, res) => {
    // res.locals.title = 'Register';
    res.render('register', { title: 'Register' });
}

//********************************** */
// function to register user
//********************************** */
module.exports.registerUser = async(req, res) => {
    try {
        const { email, username, password, firstname, lastname } = req.body; // deconstruct email, username, password, firstname, lastname from form body
        const user = new User({ email, username, firstname, lastname }); // create new user object and assign to user variable
        const registeredUser = await User.register(user, password); // register user using user object. password is hashed and salted
        req.login(registeredUser, err => { // log user in after registered
            if (err) { // if error
                next(err) // go to error middleware
            } else { // if success
                req.flash("success", "Welcome to $pent!"); // flash success message 
                res.redirect(`/user/${registeredUser._id}`) // redirect to dashboard
            }
        })
    } catch (e) { // if error
        console.log(e.message)
        req.flash("error", e.message); // flash error message
        res.redirect('/register'); // redirect back to register page
    }
}

//************************************ */
// function to render login form
//************************************ */
module.exports.renderLoginForm = (req, res) => {
    // res.locals.title = "Login"
    res.render('login', { title: 'Login' });
}

//********************************* */
// function to log user in
//********************************** */
module.exports.loginUser = async(req, res) => {
    req.flash('success', `Welcome Back, ${req.user.firstname}!`); // flash suceess message
    const redirectUrl = req.session.returnTo || `/user/${req.user._id}`; // set redirect url (in case of coming from other url user has to login to access)
    delete req.session.returnTo; // delete returnTo from session
    res.redirect(redirectUrl); // redirect to page that it should be
}

//******************************** */
// function to log user out
//******************************** */
module.exports.logoutUser = (req, res) => {
    req.logout() // log user out
    req.flash('success', 'Logged out successfully'); // flash success message
    res.redirect('/login'); // redirect user to login page
}