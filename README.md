# $PENT

## Expense Tracking Webapp

$PENT is a webapp for tracking monthly incomes and expenses. It also comes with simple data visualization to make it easier to see how much you spent on each category

## Features

- Registration, Authenthication, Authorization
- Add, Delete, and Edit incomes and expenses
- Search transactions by month and year
- Data visualization
- Separate all transactions, incomes, and expenses by tabs

## Technologies

- Node.js - Used for backend
- Express - Backend framework for Node.js
- MongoDB - Non-relational database
- JavaScript - Language used with Node.js backend and frontend.
- Bootstrap 5 - UI for web apps
- EJS - Templating to use with Node.js and Express to render HTML with data from backend

## Routes

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Route                            | Description                                |
| -------------------------------- | ------------------------------------------ |
| /login                           | route to log user in                       |
| /register                        | route to register users                    |
| /user/:id                        | route to show user dashboard               |
| /user/:id/addExpense             | route to add expense to the user           |
| /user/:id/addIncome              | route to add income to the user            |
| /user/:id/:expenseId/editExpense | route to edit expense                      |
| /user/:id/:incomeId/editIncome   | route to edit income                       |
| api/user/:id/transactions        | route to get json on transactions by month |
| api/user/:id/incomes             | route to get json on incomes by month      |
| api/user/:id/expenses            | route to get json on expenses by month     |
| api/user/:id/transactions/all    | route to get json on all transactions      |
| api/user/:id/incomes/all         | route to get json on all incomes           |
| api/user/:id/expenses/all        | route to get json on all expenses          |
