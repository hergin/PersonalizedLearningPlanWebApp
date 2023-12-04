const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const jwt = require("jsonwebtoken");
const STATUS_CODES = require("./statusCodes");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        console.log("Token was null!");
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            console.error("An error has occurred authenticating token!", err);    
            return res.sendStatus(STATUS_CODES.FORBIDDEN);
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
