const jwt = require("jsonwebtoken");
const connection = require('../../config/config');
const config = require('../../config/system_config.json');
const Joi = require("joi");
const validateRequest = require('../helper/validate_request');
const path = require('path');
const fs = require('fs');
let mail = require('../helper/mail');
const jwtDecode = require("jwt-decode");
const csv = require('csvtojson');
const atob = require('atob');
const key = 'MQMALCQJMTY0KWHHBVUF07Z9UPY6GJYMFVZ1FO9DAKU956N6';
const help = require('../helper/help');
module.exports.signupSchema = function (req, res, next) {
    console.log('hai1');
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        mobileNo: Joi.number().required(),
        password: Joi.string().required(),
        userName: Joi.string().required(),
    });
    validateRequest(req, res, next, schema);

}




module.exports.signup = function (req, res) {

    try {
        let str_sql = 'call usp_create_user(?)';
        let params = [
            req.body.fullName,
            req.body.email,
            req.body.mobileNo,
            help.encrypt(req.body.password, key),
            req.body.userName
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {

                res.status(200).json({
                    status: true,
                    message: result[0][0]['msg']
                })

            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}

module.exports.signinSchema = function (req, res, next) {
    console.log('hai1');
    const schema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, res, next, schema);

}


module.exports.signin = function (req, res) {

    try {
        let str_sql = 'call usp_get_user_details(?)';
        let params = [
            req.body.userName
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err && result[0].length > 0) {

                let sys_password = result[0][0]['password'];
                let decrypted_sys_password = help.decrypt(sys_password, key);
                let token = generateJwtToken(result[0][0].user_id, result[0][0].username);

                let token_response = parseJwt(token);
                if (decrypted_sys_password == req.body.password) {
                    res.status(200).json({
                        status: true,
                        data: {
                            'user_id': result[0][0]['user_id'],
                            'full_name': result[0][0]['full_name'],
                            'email_address': result[0][0]['email_address'],
                            'username': result[0][0]['username'],
                            'token': {
                                "accessToken": token,
                                "type": "Bearer",
                                "exp": token_response.iat,
                            }
                        }
                    })
                } else {
                    res.status(500).json({
                        status: false,
                        message: 'incorrect username/password'
                    })
                }


            } else {
                res.status(500).json({
                    status: false,
                    message: 'incorrect username/password'
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}

module.exports.forgotPassword = function (req, res) {

    try {
        let str_sql = 'call usp_update_password(?)';
        let params = [
            help.encrypt(req.body.password, key),
            req.body.userName
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {

                res.status(200).json({
                    status: true,
                    message: 'password updated'
                })


            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}



module.exports.contactSchema = function (req, res, next) {
    console.log('hai1');
    const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        mobileNo: Joi.number().required(),
        address: Joi.string().required(),
        loggedinUserId: Joi.number().required(),
    });
    validateRequest(req, res, next, schema);

}



module.exports.addContact = function (req, res) {

    try {
        let str_sql = 'call usp_create_contact(?)';
        let params = [
            JSON.stringify(req.body)
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {


                if (result[0][0]['msg'] == 'created') {
                    let sendEmail = mail.send_mail(req.body.email, 'Contact Created', 'Your Contact has been Created', '');
                    res.status(200).json({
                        status: true,
                        message: result[0][0]['msg']
                    })
                } else {
                    res.status(404).json({
                        status: true,
                        message: result[0][0]['msg']
                    })
                }



            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}


module.exports.updateContact = function (req, res) {

    try {
        let str_sql = 'call usp_update_contact(?)';
        req.body.contactId = req.params.contact_id;
        let params = [
            JSON.stringify(req.body)
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {

                let sendEmail = mail.send_mail(req.body.email, 'Contact Created', 'Your Contact has been Created', '');
                res.status(200).json({
                    status: true,
                    message: 'contact updated'
                })


            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}

module.exports.deleteContact = function (req, res) {

    try {
        let str_sql = 'call usp_delete_contact(?)';
        let params = [
            req.params.contact_id
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {


                let sendEmail = mail.send_mail(result[0][0]['email_address'], 'Contact Deleted', 'Your Contact has been deleted', '');
                res.status(200).json({
                    status: true,
                    message: 'contact deleted'
                })


            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}

module.exports.getContact = function (req, res) {

    try {
        let decrypttedToken = jwtDecode(req.token);
        console.log(decrypttedToken, decrypttedToken.user_id, 'decrypttedToken');
        let str_sql = 'call usp_contact_list(?)';
        let params = [
            decrypttedToken.user_id
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {


                res.status(200).json({
                    status: true,
                    message: 'done',
                    data: result[0]
                })


            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}

module.exports.getSpecificContact = function (req, res) {

    try {

        let str_sql = 'call usp_specific_contact_details(?)';
        let params = [
            req.params.contact_id
        ]

        connection.query(str_sql, [params], function (err, result) {
            if (!err) {


                res.status(200).json({
                    status: true,
                    message: 'done',
                    data: result[0]
                })


            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}


function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function generateJwtToken(user_id, username) {
    // creating jwt token by using userid,org id and secret key (config file)
    return jwt.sign({
            user_id: user_id,
            organisation_id: username
        },
        config.system_config.secret
    );
}