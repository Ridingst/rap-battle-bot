'use strict';

const _ = require('lodash');
const MailerModel = require('./mailer');
const config = require('../config');
const async = require('async');
const EventEmitter = require('events').EventEmitter;
const Questions = require('../models/Question.js');
const Emails = require('../models/Emails.js');
const Results = require('../models/Results.js');

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(), '-', mm, '-', dd].join(''); // padding
};




class meeting extends EventEmitter {

    /**
     * @constructor
     *
     * @param  {String} channelId
     */
    constructor(channelId, channelName) {
        super();
        this.channelId = channelId;
        this.questions = [];
        this.channelName = channelName;

        Questions.find({}, (err, questions) => {
            questions = questions.map(function(question) { return question.question});
            if (err) { 
                console.error(err);
                return res.send({status: 'error:', errors: 'err'});
            } else {
                this.questions = questions;
            };
        });
        /*this.questions = [
            'What’s your big win for the week?',
            'What barriers have you faced?',
            'Have you met the 26 hours billable target, how many hours do you expect to bill?', 
            'How many spare hours do you have?',
        ];*/
        this.answers = [];
        this.isActive = true;
    }

    setMembers(members) {
        this.participants = members;
    }

    finish(){
        this.isActive = false;
    }

    /**
     * start - Starts a conversation
     *
     * @param  {Object} bot
     * @param  {String} message
     * @return {Promise}
     */
    start(bot, message) {
        let that = this;
        let participantCount = 0;

        return new Promise((resolve, reject) => {
            async.whilst(() => {
                return participantCount < that.participants.length
            },
            (cb) => {
                let participant = that.participants[participantCount];
                message.user = participant.id;

                if(!that.isActive)
                    return;

                bot.startConversation(message, (err, convo) => {
                    convo.say('@' + participant.name +
                        ', your up... :studio_microphone:');

                    let skipParticipant = () => {
                        that.participants.push(participant);
                        convo.stop();
                    };

                    let dismissParticipant = () => {
                        convo.stop();
                    };

                    let quitConversation = () => {
                        bot.say({
                            text: 'battle is over',
                            channel: that.channelId
                        });
                        that.finish();
                        convo.stop();
                    };

                    that.once('skip', skipParticipant)
                        .once('dismiss', dismissParticipant)
                        .once('quit', quitConversation);

                    let userAnswers = [];

                    _.forEach(that.questions, (question, index) => {
                        convo.ask('@' + participant.name + ' ' + that.questions[index], (msg, convo) => {
                            switch (msg.text) {
                                case 'skip':
                                    that.emit('skip'); break;
                                case 'dismiss':
                                    that.emit('dismiss'); break;
                                case 'quit':
                                    that.emit('quit'); break;
                            }

                            userAnswers.push({
                                question: question,
                                answer: msg.text,
                                createdAt: Date.now()
                            });

                            var date = new Date();
                            var result = new Results({
                                participant: participant.name,
                                question: question,
                                answer: msg.text,
                                date: date.yyyymmdd()
                            });

                            console.log(result);

                            result.save(function(err){
                                if (err) console.error(err);
                            });

                            convo.next();
                        });
                    });

                    convo.say('@' + participant.name + ' done!');

                    convo.on('end', (convo) => {
                        if (convo.status != 'stopped') {
                            that.answers.push({
                                participant: participant,
                                answer: userAnswers
                            });
                        }

                        that.removeListener('skip', skipParticipant)
                            .removeListener('dismiss', dismissParticipant)
                            .removeListener('quit', quitConversation);

                        participantCount++;
                        cb();
                    });
                });
            }, (err) => {
                if(err) return reject(err);
                /*var sentTo = ""
                Emails.find((err, emails) => {
                    console.log('emails: ' + emails);
                    if(err) console.error(err);
                    emails = emails.map(function(email) { return email.email});
                    emails.forEach(function(email) {
                        console.log('email: ' + email);
                        let mailContent = MailerModel.mailify(that.answers);
                        let mailSender = new MailerModel(mailContent, email);
                        mailSender.send();
                        sentTo = sentTo + email + ', ';
                    });
                    bot.say({
                            text: 'battle has ended. Results are mailed to ' + sentTo,
                            channel: that.channelId
                        });
                    resolve();
                });*/
            });
        });
    }
};


module.exports = meeting;
