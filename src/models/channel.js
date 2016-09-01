'use strict';



const config = require('../config');
const slackWebApi = require('botkit/lib/Slack_web_api');
const async = require('async');

class channel {
    constructor(controller) {
        this.controller = controller;

        this.webApi = slackWebApi(controller, {
            token: config.get('token')
        });
    }

    getMembers(channelId) {
        let that = this;

        return new Promise((resolve, reject) => {
            that.webApi.channels.info({
                channel: channelId
            }, (err, res) => {
                if (err) return reject(err);
                that.name = res.channel.name
                resolve(res.channel.members);
            });
        })
        .then((members) => {
            return new Promise((resolve, reject) => {
                let channelMembers = [];

                // TODO: Do it parallel.
                async.each(members, (member, cb) => {
                    that.webApi.users.info({
                        user: member
                    }, (err, response) => {
                        if (err) return cb(err);

                        if (!response.user.is_bot)
                            channelMembers.push(response.user);

                        cb();
                    });
                }, (err, response) => {
                    if (err) return reject(err);

                    resolve(channelMembers);
                });
            });
        });
    }
}

channel.prototype.getName = function(channelId, cb) {
    this.webApi.channels.info({
            channel: channelId
        }, (err, res) => {
            if (err) return console.error(err);
            console.log(res.channel.name);
            return (res.channel.name);
        }
    );
};


module.exports = channel;
