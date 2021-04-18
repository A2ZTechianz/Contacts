const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const path = require('path');
const cors = require('cors');
const fs = require('fs');
let jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const connection = require('./config/config');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(bodyParser.xml({
    limit: '1MB', // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true, // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader('charset', 'utf-8');
    next();
});



app.use(bodyParser.urlencoded({
    extended: true
}));



app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token');
    } else {
        next(err);
    }
    return req(app).get('/').expect(401);
});
let myFilter = function (req) {
    ////console.log('r');
    let check = false;
    let filterUrls = [

    ]
    ////console.log('ck-1');
    filterUrls.forEach(fu => {

        if (RegExp(fu).test(req.originalUrl)) {
            check = true;

        }
    });

    return check;
}






app.use(function (err, req, res, next) {

    if (err.status === 404) {
        res.status(404).json({
            code: 404,
            status: false,
            message: "Not found"
        });
    } else
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({
            code: 401,
            status: false,
            message: 'Token Expired'
        });
    } else
        res.status(500).json({
            code: 500,
            status: false,
            message: "Something looks wrong :( !!!",
            txt: err
        });
});

// api routes
app.use("/api", require("./router/contacts/api"));



const server = app.listen(port, function () {
    console.log('Listening on port ' + port + ' - x:' + __dirname);
});