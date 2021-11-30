const User = require('../models/user'); // require user model

//*************************************************************** */
// function to get transactions between start date and end date
//*************************************************************** */
const getFilteredArray = (transactions, start, end) => {
    const filteredTransactions = [] // predefine filtered transactions
    for (let transaction of transactions) { // loop through all transactions
        if (transaction.createdAt >= start && transaction.createdAt < end) // if created date is between start date and end date
            filteredTransactions.push(transaction) // push the transaction into the filteredTransactions array
    }
    return filteredTransactions; // return array with filtered transactions
}

//********************************** */
// function to define next month
//********************************** */
const getNextMonth = (month) => {
    let nextMonth = null; // predefine next month 
    if (month[0] === '0' && month !== "09") { // if month is a single digit month and not 9th month
        nextMonth = '0' + (parseInt(month) + 1).toString(); // next month is month + 1 with 0 in the front
    } else if (month === '09') { // if it is 9th month
        nextMonth = (parseInt(month) + 1).toString() // next month is just current month + 1
    } else { // if month is two digits
        nextMonth = (parseInt(month) + 1).toString() // next month is just current month + 1
    }
    return nextMonth; // return next month
}

//********************************* */
// function to get date interval
//********************************* */
const getDates = (year, month, nextYear, nextMonth) => {
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`); // start date based on input month and year
    const endDateString = month === '12' ? `${nextYear}-01-01T00:00:00Z` : `${year}-${nextMonth}-01T00:00:00Z` // end date in ISO date format
    const endDate = new Date(endDateString); // end date based on end date ISO date format
    return { startDate, endDate } // return startDate and endDate
}

//***************************************** */
// function to get JSON data of the user
//***************************************** */
module.exports.getUserJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('income').populate('expense'); // find user by id, populate income and expense to be used, and stored in variable user
    res.json(user); // send json data of user's
}

//*********************************************************** */
// function to get JSON data of the user's all transactions
//*********************************************************** */
module.exports.getAllTransactionJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('income').populate('expense'); // find user by id, populate income and expense to be used, and stored in variable user
    res.json(user.transactions); // send json data of the user's transactions
}

//******************************************************** */
// function to ge JSON data of the user's all incomes
//******************************************************** */
module.exports.getAllIncomesJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('income') // find user by id, populate income to be used, and stored in variable user
    const sortedIncomes = user.income.sort(function(a, b) { // sort array to get newer data to be on top
        return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
    })
    res.json(sortedIncomes) // send json data of the user's incomes
}

//******************************************************** */
// function to ge JSON data of the user's all expenses
//******************************************************** */
module.exports.getAllExpensesJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const user = await User.findById(id).populate('expense'); // find user by id, populate income to be used, and stored in variable user
    const sortedExpenses = user.expense.sort(function(a, b) { // sort array to get newer data to be on top
        return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
    })
    res.json(sortedExpenses); // send json data of the user's expenses
}

//*********************************************************** */
// function to get transactions filtered by month and year
//*********************************************************** */
module.exports.getFilteredTransactionsJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const { month, year } = req.query; // deconstruct month and year from query

    let nextYear = (parseInt(year) + 1).toString(); // define next year 
    let nextMonth = getNextMonth(month) // get next month by calling getNextMonth() function

    const user = await User.findById(id).populate('income').populate('expense') // find user by id and populate income and expense
    const dates = getDates(year, month, nextYear, nextMonth) // get date interval by calling getDates() function

    const filteredTransactions = getFilteredArray(user.transactions, dates.startDate, dates.endDate); // transactions filterd by month and year

    res.json(filteredTransactions); // send filtered transactions in json
}

//******************************************************* */
// function to get incomes filtered by month and year
//******************************************************* */
module.exports.getFilteredIncomesJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const { month, year } = req.query; // deconstruct month and year from query

    let nextYear = (parseInt(year) + 1).toString(); // define next year
    let nextMonth = getNextMonth(month) // get next month by calling getNextMonth() function

    const user = await User.findById(id).populate('income') // find user by id and populate income and expense
    const dates = getDates(year, month, nextYear, nextMonth) // get date interval by calling getDates() function

    let filteredIncomes = getFilteredArray(user.income, dates.startDate, dates.endDate) // incomes filterd by month and year

    const sortedFilteredIncomes = filteredIncomes.sort(function(a, b) { // sort array by descending order
        return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
    })
    res.json(sortedFilteredIncomes); // send sorted filtered incomes in json
}

//******************************************************** */
// function to get expenses filtered by month and year
//******************************************************** */
module.exports.getFilteredExpensesJson = async(req, res) => {
    const { id } = req.params; // deconstruct id from parameter
    const { month, year } = req.query; // deconstruct month and year from query

    let nextYear = (parseInt(year) + 1).toString(); // define next year
    let nextMonth = getNextMonth(month) // get next month by calling getNextMonth() function

    const user = await User.findById(id).populate('expense') // find user by id and populate income and expense
    const dates = getDates(year, month, nextYear, nextMonth) // get date interval by calling getDates() function

    let filteredExpenses = getFilteredArray(user.expense, dates.startDate, dates.endDate) // expenses filterd by month and year

    const sortedFilteredExpenses = filteredExpenses.sort(function(a, b) { // sort array by descending order
        return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
    })
    res.json(sortedFilteredExpenses); // send sorted filtered incomes in json
}