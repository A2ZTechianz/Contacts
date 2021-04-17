let nodemailer = require('nodemailer');

const MailComposer = require('nodemailer/lib/mail-composer');


const sys_config = require('../../config/system_config.json');
const get_live_host_url = sys_config["system_config"]["mail_config"]["host"];
const get_live_port_url = sys_config["system_config"]["mail_config"]["port"];
const get_live_secure_url = sys_config["system_config"]["mail_config"]["secure"];
const get_live_user_url = sys_config["system_config"]["mail_config"]["user"];
const get_live_password_url = sys_config["system_config"]["mail_config"]["pass"];
const get_live_from_address_url = sys_config["system_config"]["mail_config"]["from"];
console.log(get_live_host_url, 'get_live_host_url')
module.exports.send_mail = function (to_mail, subject, content, bcc) {
    console.log(to_mail, subject, content, bcc, 'to_mail, subject, html, bcc')
    let transporter = nodemailer.createTransport({
        host: get_live_host_url,
        port: get_live_port_url,

        secure: get_live_secure_url ? get_live_secure_url : false,


        auth: {
            user: get_live_user_url,
            pass: get_live_password_url
        },
        tls: {
            rejectUnauthorized: true,

        }
    });


    let mailOptions = {
        from: get_live_from_address_url,
        to: to_mail,
        subject: subject,
        bcc: bcc,
        html: content
    }

    let mail = new MailComposer(mailOptions).compile()
    mail.keepBcc = true;
    transporter.sendMail(mailOptions, function (err) {


        if (err) {
            console.log(err, "mail error content");
            return err;

        } else {
            console.log('mail sent');
            return 1;
        }
    });
}