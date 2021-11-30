const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define expense schema
const ExpenseSchema = new Schema({
        amount: {
            type: Number, // amount has to be a number
            required: true // and required
        },
        category: {
            type: String, // category has to be string
            required: true, // is required
            enum: ['Food', 'Transportation', 'Bills', 'Shopping', 'Investment', 'Cloths', 'Others'], // choose from these
            default: 'Food' // default value is Food
        },
        description: String, // description has to be string
        transType: {
            type: String, // transtype has to be string
            enum: ['expense'] // only one value is allowed
        }
    }, { timestamps: true }) // timestamps in order to use createdAt

module.exports = mongoose.model('Expense', ExpenseSchema);