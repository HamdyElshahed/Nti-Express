const {validationResult} = require('express-validator')

function valid(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
    }

    res.status(400).json(errors)
}

module.exports = {valid}