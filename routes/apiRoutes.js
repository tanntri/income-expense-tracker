const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isOwner } = require('../middlewares');
const router = express.Router();
const api = require('../controllers/apiControllers') // require controller from apiControllers and assign to the variable api

// get route of user api. requires user to be loggedin and is the owner of the account, then use function getUserJson to return API
router.get('/:id', isLoggedIn, isOwner, catchAsync(api.getUserJson))

// get route of all transactions api. requires user to be loggedin and is the owner of the account, then use function getAllTransactionJson to send API data to the front
router.get('/:id/transactions/all', isLoggedIn, isOwner, catchAsync(api.getAllTransactionJson));

// get route of all incomes api. requires user to be loggedin and is the owner of the account, then use function getAllIncomes to send API data to the front 
router.get('/:id/incomes/all', isLoggedIn, isOwner, catchAsync(api.getAllIncomesJson));

// get route of all expenses api. requires user to be loggedin and is the owner of the account, then use function getAllExpenses to send API data to the front
router.get('/:id/expenses/all', isLoggedIn, isOwner, catchAsync(api.getAllExpensesJson));

// get route of filtered transactions api. requires usr to be loggedin and is the owner of the account, then use function getFilteredTransacitonsJson to send API data to the front
router.get('/:id/transactions', isLoggedIn, isOwner, catchAsync(api.getFilteredTransactionsJson));

// get route of filtered incomes api. requires user to be loggedin and is the owner of the account, then use function getFilteredIncomesJson to send API data to the front
router.get('/:id/incomes', isLoggedIn, isOwner, catchAsync(api.getFilteredIncomesJson));

// get route of filtered expenses api. requires user to be loggedin and is the owner of the account, then use function getFilteredExpensesJson to send API data to the front
router.get('/:id/expenses', isLoggedIn, isOwner, catchAsync(api.getFilteredExpensesJson));

// export router in order to use in index.js
module.exports = router