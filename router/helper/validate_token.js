const config = require('../../config/system_config.json');
const jwt = require("jsonwebtoken");
const connection = require('../../config/config');
async function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];



    jwt.verify(token, config.system_config.secret, (err, user) => {
        if (err) {
            res.json({
                status: 0,
                message: "Invalid Token",
                error: err,
            });
        }
        if (user) {
            req.token = token;
            next();
        }
    });
}



module.exports = verifyToken;