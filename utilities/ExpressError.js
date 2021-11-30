// ExpressError class extends from original built in Error
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // use attributes from Error
        this.message = message; // attribute message
        this.statusCode = statusCode; // attribute statusCode
    }
}

// export ExpressError
module.exports = ExpressError;