const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport

// define user schema
const UserSchema = new Schema({
    email: {
        type: String, // email has to be string
        required: true, // is required
        unique: true // and has to be unique
    },
    fund: {
        type: Number, // fund has to be number
        default: 0 // default value is 0
    },
    firstname: {
        type: String, // first name has to be string
        required: true // and is required
    },
    lastname: {
        type: String, // last name has to be string
        required: true // and is required
    },
    income: [{ // array
        type: Schema.Types.ObjectId, // object id of income. associated with Income model
        ref: 'Income' // reference to income model
    }],
    expense: [{ // array
        type: Schema.Types.ObjectId, // object id of expense. associated with Expense model
        ref: 'Expense' // reference to expense schema
    }]
}, {
    toObject: { virtuals: true, getters: true }, // set to use virtual as object
    toJSON: { virtuals: true, getters: true } // set to use virtual as json
});

// virtual property of fullname
UserSchema.virtual('fullname').get(function() {
    return this.firstname + ' ' + this.lastname; // firstname and lastname make fullname
})

// virtual property of all transactions
UserSchema.virtual('transactions').get(function() {
    let transactions = [...this.income, ...this.expense] // combined array of both income and expense
    const sortedTransaction = transactions.sort(function(a, b) { // sort by descending order
        return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0);
    })
    return sortedTransaction // return sorted
})

UserSchema.plugin(passportLocalMongoose); // automatically make username and password attribute so we didn't have to define it in schema

// export User model
module.exports = mongoose.model('User', UserSchema);