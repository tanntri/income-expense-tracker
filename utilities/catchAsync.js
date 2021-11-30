// export function that returns function
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}