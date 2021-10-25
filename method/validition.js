const jwt = require('jsonwebtoken');

function validate(req, res, next) {
    try {
     const user = jwt.verify(req.headers.authorization.split(' ')[1], '123456789');
     req.user = user;
     next();
    }
    catch(err){
        console.log(err);
        res.status(403).json({msg:'Invalid Token'})
    }
}

module.exports = {validate}