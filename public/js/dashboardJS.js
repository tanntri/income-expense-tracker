//***********************************************************
//
//  To set active tab when a tab is clicked
//
//***********************************************************
const allTab = document.getElementById('show-transactions');
const incomeTab = document.getElementById('show-incomes');
const expenseTab = document.getElementById('show-expenses');

//********************************************** */
// function to activate all transactions tab
//********************************************** */
const activateAllTab = () => {
    if (incomeTab.classList.contains('active')) { // if income tab is active
        incomeTab.classList.remove('active'); // deactivate income tab
    } else if (expenseTab.classList.contains('active')) { // if expense tab is active
        expenseTab.classList.remove('active'); // deactivate it
    }
    allTab.classList.add('active'); // activate all transactions tab
}

//*********************************** */
// function to activate income tab
//*********************************** */
const activateIncomeTab = () => {
    if (allTab.classList.contains('active')) { // if all transactions tab is active
        allTab.classList.remove('active'); // deactivate it
    } else if (expenseTab.classList.contains('active')) { // if expense tab is active
        expenseTab.classList.remove('active'); // deactivate it
    }
    incomeTab.classList.add('active'); // activate income tab
}

//*********************************** */
// function to activate expense tab
//*********************************** */
const activateExpenseTab = () => {
    if (allTab.classList.contains('active')) { // if all transactions tab is active
        allTab.classList.remove('active'); // deactivate it
    } else if (incomeTab.classList.contains('active')) { // if income tab is active
        incomeTab.classList.remove('active'); // deactivate it
    }
    expenseTab.classList.add('active'); // activate expense tab
}


allTab.classList.add('activated-tab'); // when page first load, activate all transactions tab as default  

allTab.addEventListener('click', activateAllTab); // add activateAllTab event to all transactions tab when clicked

incomeTab.addEventListener('click', activateIncomeTab); // add activateIncomeTab event to income tab when clicked

expenseTab.addEventListener('click', activateExpenseTab); // add activateExpenseTab event to expense tab when clicked


//******************************************************************** */
//
//  To create charts
//
//******************************************************************** */

const incomeChart = {
    Salary: {
        value: 0,
        bgColor: '#316B83'
    },
    Wages: {
        value: 0,
        bgColor: '#6D8299',
    },
    Investment: {
        value: 0,
        bgColor: '#8CA1A5'
    },
    Allowance: {
        value: 0,
        bgColor: '#D5BFBF'
    },
    Others: {
        value: 0,
        bgColor: '#9D84B7'
    }
}

const expenseChart = {
    Food: {
        value: 0,
        bgColor: '#316B83'
    },
    Transportation: {
        value: 0,
        bgColor: '#6D8299',
    },
    Bills: {
        value: 0,
        bgColor: '#8CA1A5'
    },
    Shopping: {
        value: 0,
        bgColor: '#6166B3'
    },
    Investment: {
        value: 0,
        bgColor: '#9D84B7'
    },
    Cloths: {
        value: 0,
        bgColor: '#D5BFBF'
    },
    Others: {
        value: 0,
        bgColor: '#009DAE'
    }
}

let doughnutCanvas1 = null;
let doughnutCanvas2 = null;
let doughnutChart1 = null;
let doughnutChart2 = null;

const renderDoughnutChart = (canvasName, chartLabels, chartData, transType, bgColor) => {
    if (canvasName === 'doughnut1') {
        doughnutCanvas1 = document.getElementById(canvasName).getContext('2d')
        doughnutChart1 = new Chart(doughnutCanvas1, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: `${transType} Percentage`,
                    data: chartData,
                    backgroundColor: bgColor
                }],
                borderWidth: 1
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `${transType} Categories Percentage (%)`,
                    }
                }

            }
        })
    } else {
        doughnutCanvas2 = document.getElementById(canvasName).getContext('2d');
        doughnutChart2 = new Chart(doughnutCanvas2, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: `${transType} Percentage`,
                    data: chartData,
                    backgroundColor: bgColor
                }],
                borderWidth: 1
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `${transType} Categories Percentage (%)`,
                    }
                }

            }
        })
    }

}
const renderCharts = async(month, year) => {
    const response = await axios.get(`${baseURL}/api/user/${userId}/transactions?month=${month}&year=${year}`); // use axios to make get request to API
    let total = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    if (doughnutCanvas1 && doughnutCanvas2) {
        doughnutCanvas1.clearRect(0, 0, doughnutCanvas1.width, doughnutCanvas1.height);
        doughnutChart1.destroy();
        doughnutCanvas2.clearRect(0, 0, doughnutCanvas2.width, doughnutCanvas2.height);
        doughnutChart2.destroy();
    } else if (doughnutCanvas2) {
        doughnutCanvas2.clearRect(0, 0, doughnutCanvas2.width, doughnutCanvas2.height);
        doughnutChart2.destroy();
    } else if (doughnutCanvas1) {
        doughnutCanvas1.clearRect(0, 0, doughnutCanvas1.width, doughnutCanvas1.height);
        doughnutChart1.destroy();
    }

    try {
        for (let transaction of response.data) { // loop through data from response
            if (transaction.transType === 'income') { // if transaction type is income, render as income
                incomeChart[transaction.category].value += transaction.amount
                totalIncome += transaction.amount
                total += transaction.amount // increment total

            } else { // if transaction type is expense, render as expense
                expenseChart[transaction.category].value += transaction.amount
                totalExpense += transaction.amount
                total -= transaction.amount // decrement total
            }
        }

        let keysArray = Object.keys(incomeChart)
        let incomePercentageValues = []
        let bgColorArray = []
        for (let key of keysArray) {
            console.log(incomeChart[key].value)
            if (incomeChart[key].value !== 0) {
                incomeChart[key].value = ((incomeChart[key].value / totalIncome) * 100).toFixed(2);
            } else {
                incomeChart[key].value = 0
            }
            incomePercentageValues.push(incomeChart[key].value);
            bgColorArray.push(incomeChart[key].bgColor)
        }

        renderDoughnutChart('doughnut1', keysArray, incomePercentageValues, 'Income', bgColorArray);
        incomePercentageValues = [];
        for (let key of keysArray) {
            incomeChart[key].value = 0
        }

        keysArray = Object.keys(expenseChart)
        let expensePercentageValues = []
        bgColorArray = []
        for (let key of keysArray) {
            console.log(expenseChart[key].value)
            if (expenseChart[key].value !== 0) {
                expenseChart[key].value = ((expenseChart[key].value / totalExpense) * 100).toFixed(2);
            } else {
                expenseChart[key].value = 0
            }
            expensePercentageValues.push(expenseChart[key].value);
            bgColorArray.push(expenseChart[key].bgColor)
        }
        renderDoughnutChart('doughnut2', keysArray, expensePercentageValues, 'Expense', bgColorArray);
        expensePercentageValues = [];
        for (let key of keysArray) {
            expenseChart[key].value = 0
        }
    } catch (e) { // if error
        console.log('error', e); // inform error in the console
    }
}


// *****************************************************************************************
//
//  To get data from API and display it it div without reloading page
//
//****************************************************************************************** */

// object of class name for font awesome to match transaction category
const transactionIcons = {
    Food: 'fa-hamburger',
    Transportation: 'fa-car',
    Bills: 'fa-file-invoice-dollar',
    Shopping: 'fa-shopping-bag',
    Investment: 'fa-search-dollar',
    Cloths: 'fa-tshirt',
    Salary: 'fa-money-check-alt',
    Wages: 'fa-money-bill',
    Allowance: 'fa-hand-holding-usd',
    Others: 'fa-ellipsis-h'
}


const transactionUl = document.getElementById('money-info'); // assign money-info html id to variable transactionUl
const showExpense = document.getElementById('show-expenses'); // assign show-expenses html id to variable showExpense
const showIncome = document.getElementById('show-incomes'); // assign show-incomes html id to variable showIncome
const showAllTransactions = document.getElementById('show-transactions'); // assign show-transactions html id to variable showAllTransactions
let doughnut1 = document.getElementById('doughnut1');
let doughnut2 = document.getElementById('doughnut2');

const baseURL = window.location.origin; // base url to call api
console.log(baseURL)

//********************************** */
// function to get date
//********************************** */
const getDate = (isoDate) => {
    const fullDateTime = new Date(isoDate); // get javascript date from ISO date
    const fullDate = `${fullDateTime.getFullYear()}` + '-' + `${fullDateTime.getMonth()}` + '-' + `${fullDateTime.getDate()}`; // get full date
    return fullDate; // return full date
}

//******************************************* */
// function to render all transactions
//******************************************* */
const renderAllTransactions = (response) => {
    transactionUl.innerHTML = ''; // set innerHTML of transactionUl to empty
    let total = 0; // predefine total to 0 (used to calculate total fund left of the month)
    try {
        for (let transaction of response.data) { // loop through data from response
            if (transaction.transType === 'income') { // if transaction type is income, render as income
                transactionUl.innerHTML += '<li class="list-group-item income">' +
                    '<div class="row transaction-info">' +
                    `<div class="col-md-1 transaction-icon"><i class="fas ${transactionIcons[transaction.category]}"></i></div>` +
                    '<div class="col-md-2"><div class="transaction-cat">' + transaction.category + '</div>' +
                    '<div class="transaction-date">' + getDate(transaction.createdAt) + '</div></div>' +
                    '<div class="col-md-3">' + transaction.description + '</div>' +
                    '<div class="col-md-3 transaction-amount">+$' + transaction.amount + '</div>' +
                    `<div class="col-md-3 transaction-buttons"><a class='btn btn-primary btn-sm' href="/user/${userId}/${transaction._id}/editIncome">Edit</a>` +
                    `<form class='d-inline' action="/user/${userId}/${transaction._id}/deleteTransaction?_method=DELETE" method='POST'><button class='btn btn-danger btn-sm'>Delete</button></form>` +
                    '</div></div></li>';
                total += transaction.amount // increment total

            } else { // if transaction type is expense, render as expense
                transactionUl.innerHTML += '<li class="list-group-item expense">' +
                    '<div class="row transaction-info">' +
                    `<div class="col-md-1 transaction-icon"><i class="fas ${transactionIcons[transaction.category]}"></i></div>` +
                    '<div class="col-md-2"><div class="transaction-cat">' + transaction.category + '</div>' +
                    '<div class="transaction-date">' + getDate(transaction.createdAt) + '</div></div>' +
                    '<div class="col-md-3">' + transaction.description + '</div>' +
                    '<div class="col-md-3 transaction-amount">-$' + transaction.amount + '</div>' +
                    `<div class="col-md-3 transaction-buttons"><a class='btn btn-primary btn-sm' href="/user/${userId}/${transaction._id}/editIncome">Edit</a>` +
                    `<form class='d-inline' action="/user/${userId}/${transaction._id}/deleteTransaction?_method=DELETE" method='POST'><button class='btn btn-danger btn-sm'>Delete</button></form>` +
                    '</div></div></li>';
                total -= transaction.amount // decrement total
            }
        }
        // add up the total and display at the bottom of the card
        transactionUl.innerHTML += '<li class="list-group-item"><div class="row transaction-info"><div class="col-md-12 total"> Monthly fund: $' + total.toFixed(2) + '</div></div></li>'
            // renderCharts(response);
    } catch (e) { // if error
        console.log('error', e); // inform error in the console
    }
}

//********************************* */
// function to render incomes
//********************************* */
const renderIncomes = (response) => {
    transactionUl.innerHTML = ''; // set innerHTML of transactionUl to empty
    let totalIncome = 0; // predefine totalIncome to 0
    try {
        let incomes = response.data.sort(function(a, b) { // sort income gotten from response
            return (a.date > b.date) ? -1 : ((a.date < b.date) ? 1 : 0);
        })
        for (let income of incomes) { // loop through incomes, and update content of transactionUl with income data
            transactionUl.innerHTML += '<li class="list-group-item income">' +
                '<div class="row transaction-info">' +
                `<div class="col-md-1 transaction-icon"><i class="fas ${transactionIcons[income.category]}"></i></div>` +
                '<div class="col-md-2"><div class="transaction-cat">' + income.category + '</div>' +
                '<div class="transaction-date">' + getDate(income.createdAt) + '</div></div>' +
                '<div class="col-md-3">' + income.description + '</div>' +
                '<div class="col-md-3 transaction-amount">+$' + income.amount + '</div>' +
                `<div class="col-md-3 transaction-buttons"><a class='btn btn-primary btn-sm' href="/user/${userId}/${income._id}/editIncome">Edit</a>` +
                `<form class='d-inline' action="/user/${userId}/${income._id}/deleteTransaction?_method=DELETE" method='POST'><button class='btn btn-danger btn-sm'>Delete</button></form>` +
                '</div></div></li>';
            totalIncome += income.amount // increment total income
        }

        // add up total income and display at the bottom of the card
        transactionUl.innerHTML += '<li class="list-group-item"><div class="row transaction-info"><div class="col-md-12 total">You earned: $' + totalIncome.toFixed(2) + '</div></div></li>'

    } catch (e) {
        console.log('error', e); // if error exists, inform in console
    }

}

// ************************************
// function to render expenses
// ************************************ */
const renderExpenses = (response) => {
    transactionUl.innerHTML = ''; // set innerHTML of transactionUl to empty
    let totalExpense = 0; // predefine total expense to 0
    try {
        let expenses = response.data.sort(function(a, b) { // sort expenses gotten from response
            return (a.date > b.date) ? -1 : ((a.date < b.date) ? 1 : 0);
        })
        for (let expense of expenses) { // loop through expenses
            transactionUl.innerHTML += '<li class="list-group-item expense">' + // update transactionUl content accordingly
                '<div class="row transaction-info">' +
                `<div class="col-md-1 transaction-icon"><i class="fas ${transactionIcons[expense.category]}"></i></div>` +
                '<div class="col-md-2"><div class="transaction-cat">' + expense.category + '</div>' +
                '<div class="transaction-date">' + getDate(expense.createdAt) + '</div></div>' +
                '<div class="col-md-3">' + expense.description + '</div>' +
                '<div class="col-md-3 transaction-amount">-$' + expense.amount + '</div>' +
                `<div class="col-md-3 transaction-buttons"><a class='btn btn-primary btn-sm' href="/user/${userId}/${expense._id}/editIncome">Edit</a>` +
                `<form class='d-inline' action="/user/${userId}/${expense._id}/deleteTransaction?_method=DELETE" method='POST'><button class='btn btn-danger btn-sm'>Delete</button></form>` +
                '</div></div></li>';
            totalExpense += expense.amount // increment total expense
        }

        // add up all the expenses and display at the bottom of the card
        transactionUl.innerHTML += '<li class="list-group-item"><div class="row transaction-info"><div class="col-md-12 total">You spent: $' + totalExpense.toFixed(2) + '</div></div></li>'


    } catch (e) {
        console.log('error', e); // if error exists, inform in console
    }

}

// ******************************************************************** */
// function to get data of all transactions from API using Axios
// ******************************************************************** */
const getAllTransactions = async() => {
    try {
        const res = await axios.get(`${baseURL}/api/user/${userId}/transactions/all`); // use axios to make get request to API
        renderAllTransactions(res); // call function to render all transactions with data in res
    } catch (e) {
        console.log(e) // if error exists, inform in console
    }
}

//******************************************************************** */
// function to get data of all incomes from API using Axios
//******************************************************************** */
const getAllIncomes = async() => {
    try {
        const res = await axios.get(`${baseURL}/api/user/${userId}/incomes/all`); // use axios to make get request to API
        renderIncomes(res); // call function to render incomes with data in res
    } catch (e) {
        console.log(e) // if error exists, inform in console
    }
}

//************************************************************ */
// function to get data of all expenses from API using Axios
//************************************************************ */
const getAllExpenses = async() => {
    try {
        const res = await axios.get(`${baseURL}/api/user/${userId}/expenses/all`); // use axios to make get request to API
        renderExpenses(res); // call function to render expenses with data in res
    } catch (e) {
        console.log(e) // if error exists, inform in console
    }

}


const d = new Date(); // get current date and assign to variable d
let currentMonth = d.getMonth() + 1; // get current month
let currentYear = d.getFullYear(); // get current year

//************************************************************************ */
// function to get data of filtered transactions based on month and year
//************************************************************************ */
const getFilteredTransactions = async(load, month, year) => {
    try {
        if ((month.toString()).length === 1) { // if month is one digit
            month = '0' + month.toString(); // add 0 in front
        }
        const res = await axios.get(`${baseURL}/api/user/${userId}/transactions?month=${month}&year=${year}`); // use axios to make get request to API
        renderAllTransactions(res); // call function to render all transactions of the month using data from res
        // renderCharts(res)
    } catch (e) {
        console.log(e) // if error exists, inform in console
    }

}

//********************************************************************* */
// function to get data of filtered incomes based on month and year
//********************************************************************* */
const getFilteredIncomes = async(load, month, year) => {
    try {
        if ((month.toString()).length === 1) { // if month is a one digit number
            month = '0' + month.toString(); // add 0 in front
        }
        const res = await axios.get(`${baseURL}/api/user/${userId}/incomes?month=${month}&year=${year}`); // use axios to make get request to API
        renderIncomes(res); // call function to render expenses of the month using data from res
    } catch (e) {
        console.log(e) // if error exists, inform in console
    }
}

//********************************************************************* */
// function to get data of filtered expenses based on month and year
//********************************************************************* */
const getFilteredExpenses = async(load, month, year) => {
    try {
        if ((month.toString()).length === 1) { // if month is a one digit number
            month = '0' + month.toString(); // add 0 in front
        }
        const res = await axios.get(`${baseURL}/api/user/${userId}/expenses?month=${month}&year=${year}`); // use axios to make get request to API
        renderExpenses(res);
    } catch (e) { console.log(e) } // if error exists, inform in console
}

// when the page is loaded, call getFilteredTransactions function based on current month and year
window.onload = () => {
    getFilteredTransactions(null, currentMonth, currentYear)
    renderCharts(currentMonth, currentYear)
};

let month = currentMonth // assign current month to the variable month when the page is loaded
let year = currentYear // assign current year to the variable year when the page is loaded

// add event of function of getFilteredExpenses to showExpenses when clicked
showExpense.addEventListener('click', () => getFilteredExpenses(null, month, year));

// add event of function of getFilteredIncomes to showIncomes when clicked
showIncome.addEventListener('click', () => getFilteredIncomes(null, month, year));

// add event of function of getFilteredTransactions to showAllTransacitons when clicked
showAllTransactions.addEventListener('click', () => getFilteredTransactions(null, month, year));

// object of month to pair with month name
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
    12: 'December',
}

const form = document.getElementById('date-form'); // assign form with id date-form to variable form
const cardTitle = document.getElementById('title-of-card'); // assign field id title-of-card to variable cardTitle

//*********************************** */
// function to search by month
//*********************************** */
const searchByMonth = async(evt) => {
    evt.preventDefault(); // prevent page to reload when the form is submitted
    // doughnutCanvas1.clearRect(0, 0, doughnutCanvas1.width, doughnutCanvas1.height);
    // doughnutCanvas2.clearRect(0, 0, doughnutCanvas2.width, doughnutCanvas2.height);
    // doughnutChart1.destroy();
    // doughnutChart2.destroy();
    const formData = new FormData(form); // assign data from the form to the variable formData
    const params = new URLSearchParams(formData); // get url parameter from formData and assign to the variable params
    // doughnutChart.destroy();
    month = params.get('month'); // update value of month with value of month from params
    year = params.get('year'); // update value of year with value of year from params
    cardTitle.innerHTML = months[month] + ' ' + year // update card title with month and year
    renderCharts(month, year);
    if (allTab.classList.contains('active')) { // if allTab is active
        getFilteredTransactions(null, month, year); //call getFilteredTransactions function to render transactions
    } else if (incomeTab.classList.contains('active')) { // if incomeTab is active
        getFilteredIncomes(null, month, year) // call getFilteredIncomes function to render incomes
    } else { // if expenseTab is active
        getFilteredExpenses(null, month, year) // call getFilteredExpenses function to render expenses
    }
}

form.addEventListener('submit', searchByMonth); // add event of searchByMonth to the form when submitted