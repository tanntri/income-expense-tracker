const User = require('../models/user'); // require user model
const Income = require('../models/income'); // require income model
const Expense = require("../models/expense"); // require expense model

// months object to display month name
const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

//********************************* */
// function to render dashboard
//********************************* */
module.exports.renderDashboard = async(req, res) => {
    // res.locals.title = "Dashboard";
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('income').populate('expense'); // find user by id and populate income and expense (necessary to use user.transactions)
    let thisMonth = new Date(); // current date
    let mm = String(thisMonth.getMonth() + 1).padStart(2, '0'); // January is 0
    let yyyy = thisMonth.getFullYear(); // year
    let monthName = months[mm] // month name using mm with months object
    let minYear = 2017 // start year to be used in dropdown
    const yearList = [] // predefine list of year
    for (let i = minYear; i <= yyyy; i++) { // loop from minYear to current year
        yearList.push(i); // push years into yearList array
    }
    res.render('dashboard/dashboard', { user, monthName, yyyy, months, yearList }); // render dashboard with these variables
}

//********************************** */
// function to reate transaction
//********************************** */
module.exports.createTransaction = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id) // find user by id
    if (req.body.income) { // if created from income form
        let income_amount = parseFloat(req.body.income.amount); // assign income amount to the variable
        req.body.income.amount = income_amount.toFixed(2) // make income amount float fixed to 2 points
        const income = new Income(req.body.income) // create new income object
        income.transType = 'income' // assign transaction type as income
        user.income.push(income._id) // push income id to income array field of user's
        await income.save() // save income collection
    } else { // if created from expense form
        let expense_amount = parseFloat(req.body.expense.amount); // assign expense amount to the variable
        req.body.expense.amount = expense_amount.toFixed(2) // make expense amount float fixed to 2 points
        const expense = new Expense(req.body.expense) // create new expense object 
        expense.transType = 'expense' // assign transaction type as expense
        user.expense.push(expense) // push expense id to expense array field of user's
        await expense.save() // save expense collection
    }
    await user.save() // save user collection
    res.redirect(`/user/${user._id}`) // redirect back to user dashboard
}

//**************************************** */
// function to render add income form
//**************************************** */
module.exports.renderAddIncomeForm = (req, res) => {
    // res.locals.title = 'Add Income'
    res.render('transactions/addincome');
}

//***************************************** */
// function to render add expense form
//***************************************** */
module.exports.renderAddExpenseForm = (req, res) => {
    // res.locals.title = 'Add Expense';
    res.render('transactions/addexpense');
}

//**************************************** */
// function to render edit income form
//**************************************** */
module.exports.renderEditIncomeForm = async(req, res) => {
    // res.locals.title = 'Edit Income'
    const { id, incomeId } = req.params; // deconstruct user id and income id from parameters
    const user = await User.findById(id) // find user by id
    const income = await Income.findById(incomeId); // find income by id
    if (!income) { // if income is not found
        req.flash('error', 'Income ID not found'); // flash error message
        return res.redirect(`/user/${req.user._id}`); // redirect back to dashboard
    }
    res.render('transactions/editincome', { income, user }); // render edit form with pre-filled values

}

//*********************************** */
// function to update income
//*********************************** */
module.exports.updateIncome = async(req, res) => {
    const { incomeId } = req.params; // deconstruct income id from parameters
    await Income.findByIdAndUpdate(incomeId, {...req.body.income }); // find income by id and update with values in form
    req.flash('success', 'Successfully updated income') // flash success message
    res.redirect(`/user/${req.user._id}`); // redirect back to user's dashboard
}

//****************************************** */
// function to render edit expense form
//****************************************** */
module.exports.renderEditExpenseForm = async(req, res) => {
    // res.locals.title = 'Edit Expense';
    const { id, expenseId } = req.params; // deconstruct user id and expense id from parameters
    const user = await User.findById(id) // find user by id
    const expense = await Expense.findById(expenseId); // find expense by id
    if (!expense) { // if expense is not found
        req.flash('error', 'Expense ID not found'); // flash error message
        return res.redirect(`/user/${req.user._id}`); // redirect back to user dashboard
    }
    res.render('transactions/editexpense', { expense, user }); // if found, render form with pre-filled values

}

//*********************************** */
// function to update expense
//*********************************** */
module.exports.updateExpense = async(req, res) => {
    const { expenseId } = req.params; // deconstruct expense id from parameters
    await Expense.findByIdAndUpdate(expenseId, {...req.body.expense }); // find expense by id and update using data from form
    req.flash('success', 'Successfully updated expense') // flash success message
    res.redirect(`/user/${req.user._id}`); // redirect to user dashboard
}

//************************************** */
// function to delete transaction
//************************************** */
module.exports.deleteTransaction = async(req, res) => {
    const { id, transactionId } = req.params; // deconstruct id and transactionId from req.params
    const user = await User.findById(id).populate('income').populate('expense'); // fund user by id and populate income and expense (required to use user.transactions)
    const transactions = user.transactions; // assign user.transactions to transactions variable
    for (let transaction of transactions) { // loop through all transactions
        if (transactionId === transaction._id.toString()) { // if transaction id from parameter equals to transaction id from database
            if (transaction.transType === 'income') { // and if the transaction type is income
                await Income.findByIdAndDelete(transactionId); // find income by id and delete
                await user.updateOne({ $pull: { income: transactionId } }) // pull out the income id from user's income array field
                req.flash('success', 'Successfully deleted income') // flash success message
                return res.redirect(`/user/${id}`) // redirect back to dashboard
            } else { // if transaction type is expense
                await Expense.findByIdAndDelete(transactionId); // find expense by id and delete
                await user.updateOne({ $pull: { expense: transactionId } }) // pull out the expense id from user's expense array field
                req.flash('success', 'Successfully deleted expense') // flash success message
                return res.redirect(`/user/${id}`) // redirect back to dashboard
            }
        }
    }

    req.flash('error', "couldn't find matching transaction id") // if reached here, it means no transaction id found. flash error message
    res.redirect(`/user/${id}`) // redirect back to dashboard
}