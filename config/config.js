let mysql = require('mysql');
let con = require('./system_config.json');
let db_con = con["system_config"]["db_config"]


let connection = mysql.createConnection(db_con);


connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log(err, "Error while connecting with database");
    }
});


module.exports = connection;