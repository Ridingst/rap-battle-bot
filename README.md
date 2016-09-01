
Mailer service uses nodemailer's transport methods. Therefore, for better understanding please read nodemailer's [available transports ](https://github.com/andris9/Nodemailer#available-transports).

## Environment Variables ##
### Local ###
Create a file named production under /config/production.json
For email settings:
```
{
    "token": "slack bot token here",
    "mail-service": "Gmail",
    "mail-email": "mail@thomasridings..com",
    "mail-pass": "Password here"
}
```

### Live ###

The above env variables need to set along with PORT = 80, mail-from & mail-to.
nconf is clever enough to pick the environment variables over the local JSONs.

## Usage

### Install dependencies
```
npm install
```


### Start your bot.

```
npm start
```

### Commands

- ``` start battle ```

    Starts battle. To be able to start battle with this command your bot should be invited to the channel.

- ``` skip ```

    Skips the current user's turn. Asks/Returns to the skipped users again at the end of the meeting. Can be skipped more than once.

- ``` dismiss ```

    Dismisses the current user, in other words kicks the current user out of the meeting. Useful in case of an absence.

- ``` quit ```

    Ends the meeting. Meeting can be restarted by typing ``` start meeting ``` again.

### Tech

Slack-Manager uses a number of open source projects to work properly:

* [Botkit](https://github.com/howdyai/botkit) - Botkit - Building Blocks for Building Bots
* [Node-mailer](https://github.com/andris9/Nodemailer) - Send e-mails with Node.JS – easy as cake! E-mail made in Estonia.
* [Lodash](https://github.com/lodash/lodash) - A JavaScript utility library delivering consistency, modularity, performance, & extras.
* [Async](https://github.com/caolan/async) - Async utilities for node and the browser.
* [Nconf](https://github.com/indexzero/nconf) - Hierarchical node.js configuration with files, environment variables, command-line arguments, and atomic object merging.