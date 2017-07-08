const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      Pusher = require('pusher'),
      PUSHER_CONFIG = require('./src/config/pusher-variables').PUSHER_CONFIG,
      app = express();

/**
 * Initialize Pusher with appId, key and secret
 */

const pusher = new Pusher({
  appId: PUSHER_CONFIG.appId,
  key: PUSHER_CONFIG.key,
  secret: PUSHER_CONFIG.secret,
  cluster: PUSHER_CONFIG.cluster,
  encrypted: PUSHER_CONFIG.encrypted
});

/**
 * Body parser middleware
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * API route which the chat messages will be sent to
 */

app.post('/message/send', (req, res) => {
  // 'private' is prefixed to indicate that this is a private channel
  pusher.trigger('private-reactchat', 'messages', {
    message: req.body.message,
    username: req.body.username
  });
  res.sendStatus(200);
});

/**
 * API routeused by Pusher as a way of authenticating users
 */

app.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

/**
 * Set port to be used by Node.js
 */
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
