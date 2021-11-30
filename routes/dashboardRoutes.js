const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router(); // use router
const { isLoggedIn, isOwner, calculateFund } = require('../middlewares');
const dashboard = require('../controllers/dashboardControllers');

// route of user id
router.route('/:id')
    .get(isLoggedIn, isOwner, calculateFund, catchAsync(dashboard.renderDashboard)) // get route of dashboard, used to render dashboard page
    .post(catchAsync(dashboard.createTransaction)) // post route of dashboard, used to create new income or expense

// get route of add income. used to render add income form
router.get('/:id/addIncome', dashboard.renderAddIncomeForm);

// get route of add expense. used to render add expense form
router.get('/:id/addExpense', dashboard.renderAddExpenseForm);

// route of income id and edit income
router.route('/:id/:incomeId/editIncome')
    .get(isLoggedIn, isOwner, catchAsync(dashboard.renderEditIncomeForm)) // get route to render edit income form
    .put(isLoggedIn, isOwner, catchAsync(dashboard.updateIncome)) // put route to update income

// route of expense id and edit expense
router.route('/:id/:expenseId/editExpense')
    .get(isLoggedIn, isOwner, catchAsync(dashboard.renderEditExpenseForm)) // get route is to render edit expense form
    .put(isLoggedIn, isOwner, catchAsync(dashboard.updateExpense)); // put route is to update expense

// delete route is used to delete transactions
router.delete('/:id/:transactionId/deleteTransaction', isLoggedIn, isOwner, catchAsync(dashboard.deleteTransaction));

// export router in order to use in index.js
module.exports = router;