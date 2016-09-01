'use strict';

const nodemailer = require('nodemailer');
const config = require('../config');
const Email = require('../models/Emails.js');



class mailer {
    /**
     * @constructor
     *
     * @param  {String} content
     */
    constructor(content, email, opt_settings) {
        this.content = content;

        this.transporter = nodemailer.createTransport(opt_settings || {
            service: config.get('mail-service'),
            auth: {
                user: config.get('mail-email'),
                pass: config.get('mail-pass')
            }
        });

        console.log('emails: ' + email)

        this.options = {
            from: config.get('mail-from'),
            to: email,
            subject: 'About your meeting today',
            text: content || 'No body.'
        };
    }


    /**
     * send - Sends an email with pre-set settings.
     */
    send() {
        this.transporter.sendMail(this.options);
    }

    static mailify(answers){
        let mailContent = "Hello, \nToday's battle results are shown below.\n";
        answers.forEach((answer) => {
            mailContent += "\n" + answer.participant.real_name + " responded:\n\n";
            answer.answer.forEach((entry, index) => {
                mailContent += entry.question + "\n" + entry.answer + "\n";
            });
        });

        return mailContent;
    }
}


module.exports = mailer;
