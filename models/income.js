const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
        amount: {
            type: Number, // amount has to be number
            required: true // and required
        },
        category: {
            type: String, // category has to be string
            enum: ['Salary', 'Wages', 'Investment', 'Allowance', 'Others'], // choose from these
            default: 'Salary' // default is salary
        },
        description: String, // description has to be string
        transType: {
            type: String, // transtype has to be string
            enum: ['income'] // only one value is allowed
        }
    }, { timestamps: true }) // timestamps in order to use createdAt

module.exports = mongoose.model('Income', IncomeSchema);