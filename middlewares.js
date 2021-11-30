const User = require('./models/user');
const catchAsync = require('./utilities/catchAsync');

//************************************************** */
// middleware to check if any user is in session
//************************************************** */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // if not authenticated
        req.session.returnTo = req.originalUrl; // store the url the user was at initially in the session
        req.flash("error", "You must be logged in") // flash the message that says they need to log in
        return res.redirect('/login') // redirect to login page
    } else {
        next()
    }
}

//*********************************************************************************************** */
// middleware to check if the current user is the owner of the account they try to access
//*********************************************************************************************** */
module.exports.isOwner = catchAsync(async(req, res, next) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id); // find user from parameter id and store a whole user in user variable
    if (user._id.equals(req.user._id)) { // if parameter's id doesn't match with current user's id
        next()
    } else {
        req.flash('error', 'You do not have permission to access') // flash error message
        return res.redirect(`/user/${req.user._id}`) // redirect back to current user's dashboard
    }
})

//************************************************************************ */
// middleware to calculate total fund to be displayed on the dashboard
//************************************************************************ */
module.exports.calculateFund = catchAsync(async(req, res, next) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('income').populate('expense'); //find user by id and populate income and expense
    user.fund = 0 // set user's fund to 0
    for (let transaction of user.transactions) { // loop through all of the user's transaction
        if (transaction.transType === 'income') { // recalculate the funds
            user.fund += parseFloat(transaction.amount.toFixed(2))
        } else if (transaction.transType === 'expense') {
            user.fund -= parseFloat(transaction.amount.toFixed(2))
        } else {
            user.fund += 0
        }
    }
    user.fund = parseFloat(user.fund.toFixed(2)); // assign new calculated value to user's fund
    await user.save() // save user collection
    next() // proceeds
})