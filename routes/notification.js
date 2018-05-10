var express = require('express');

var router = express.Router();

const fetch = require('node-fetch');
const gcm = require('node-gcm');

router.post('/send', (req, res, next) => {
    var params = JSON.parse(req.body.data);
    console.log(params);
    var to = params.fcmToken;
    var title = params.title;
    var body = params.body;
    var icon = params.icon;
    var sound = params.sound;
    var click_action = params.click_action;

    var key = 'AAAAoY5gPM8:APA91bGcVJKiJ3ARJ784RFBnHJZiKtpI8O1bl2iGHT_CIF406FelB-ICTHiksvo_sHK6cAgTWcI_r-jnFovqis2xxZAB15W4DUaKZ1dqHwwUnp6Y69RIUVL8v_TThzNiaNoAVWcbFlVI';
    var notification = {
      'title': title,
      'body': body,
      'icon': icon,
      'sound': sound,
      'click_action': click_action
    };
    fetch('https://fcm.googleapis.com/fcm/send', {
      'method': 'POST',
      'headers': {
        'Authorization': 'key=' + key,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'notification': notification,
        'to': to
      })
    }).then(function(response) {
      console.log('success: ', response);
      res.status(200).send(response);
    }).catch(function(error) {
      console.error('error: ', error);
      res.status(402).send(error);
    })

});

router.post('/fcm', (req, res, next) => {
  var params = JSON.parse(req.body.data);
  console.log(params);
  var to = params.fcmToken;
  var title = params.title;
  var body = params.body;
  var icon = params.icon;
  var sound = params.sound;
  var click_action = params.click_action;

  const key = params.key;
  console.log('key: ', key);

  var notification = {
    'title': title,
    'body': body,
    'icon': icon,
    'sound': sound,
    'click_action': click_action
  };
  fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'notification': notification,
      'to': to
    })
  }).then(function(response) {
    console.log('success: ', response);
    res.status(200).send(response);
  }).catch(function(error) {
    console.error('error: ', error);
    res.status(402).send(error);
  })

});

router.post('/gcm', (req, res, next) => {
  
      var to = req.body.fcmToken;
      var title = req.body.title;
      var body = req.body.body;
      var icon = req.body.icon;
      var sound = req.body.sound;
      var click_action = req.body.click_action;
  
      var key = 'AAAAoY5gPM8:APA91bGcVJKiJ3ARJ784RFBnHJZiKtpI8O1bl2iGHT_CIF406FelB-ICTHiksvo_sHK6cAgTWcI_r-jnFovqis2xxZAB15W4DUaKZ1dqHwwUnp6Y69RIUVL8v_TThzNiaNoAVWcbFlVI';
      var notification = {
        'title': title,
        'body': body,
        'icon': icon,
        'sound': sound,
        'click_action': click_action
      };
      
     var sender = new gcm.Sender(key);
      
     // Prepare a message to be sent
     var message = new gcm.Message({
      'notification': notification
     });
      
     // Specify which registration IDs to deliver the message to
     var regTokens = [];
     regTokens.push(to);
      
     // Actually send the message
     sender.send(message, { registrationTokens: regTokens }, function (err, response) {
         if (err) {
           console.error(err);
           res.status(402).send(response);
         }
         else {
            res.status(200).send(response);
           console.log(response);
          }
     });
  
  });

module.exports = router;