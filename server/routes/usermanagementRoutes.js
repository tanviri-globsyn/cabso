  var express = require('express');
  var app = express();
  var router = express.Router();
  var User = require('../schema/user');
  const UserDevices = require('../schema/userdevices');
  const DriverDevices = require('../schema/driverdevices');
  const Notifications = require("../schema/notification");
  const Admin = require('../models/admin');
  var FCM = require('fcm-push');


  // router.route('/').get(function (req, res) {
  //     User.find(function (err, user){
  //      if(err){
  //       return res.json({error: true, msg: err});
  //      }
  //      else {
  //        res.json(user);
  //      }
  //    });
  //  });


  router.route('/').get(function (req, res) {
    User.find().sort({ $natural: -1 })
    .exec(function (err, user) {
      if (err) {
        return res.json({ error: true, msg: "Unable to load records from database" });
      }
      else {
        res.json(user);
      }

    });
  });


  router.route('/latestUser').get(function (req, res) {
    User.find().sort({ $natural: -1 }).limit(10)
    .exec(function (err, user) {
      if (err) {
        return res.json({ error: true, msg: "Unable to load records from database" });
      }
      else {
        res.json(user);
      }

    });
  });

  router.route('/deactive/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (!user)
        return next(new Error('Could not load Document'));
      else {
        user.active = 0;
        user.save().then(user => {
          return res.json({ success: true, msg: 'User Deactivated Successfully' });
        })
        .catch(err => {
          return res.json({ error: true, msg: "Error with Deactivation" });

        });
      }
    });
  });

  router.route('/active/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (!user)
        return next(new Error('Could not load Document'));
      else {
        user.active = 1;
        user.save().then(user => {
          return res.json({ success: true, msg: 'User Activated Successfully' });
        })
        .catch(err => {
          return res.json({ error: true, msg: "Error with activation" });

        });
      }
    });
  });


  router.route('/info/:id').get(function (req, res) {
    User.findById(req.params.id, function (err, user) {
      res.json(user);
    })
  });


  router.route('/userCount').get(function (req, res) {
    User.count(function (err, count) {
      if (err)
        return res.json({ error: true, msg: "User not exists" });
      res.json(count);
    });
  });


  router.route('/iosUser').get(function (req, res) {
    UserDevices.count({ device_type: 0 })
    .exec(function (err, user) {
      if (err) {
        return res.json({ error: true, msg: "Unable to load records from database" });
      }
      else {
        res.json(user);
      }

    });
  });


  router.route('/andoridUser').get(function (req, res) {
    UserDevices.count({ device_type: 1 })
    .exec(function (err, user) {
      if (err) {
        return res.json({ error: true, msg: "Unable to load records from database" });
      }
      else {
        res.json(user);
      }

    });
  });



  router.route('/pushNotify').post(function (req, res) {
    if (req.body.user == 0) {
      UserDevices.find({ device_type: "0" })
      .exec(function (err, records) {
        var isendnotifications = [];
        var iosids=[];
        var message = req.body.message;
        let data = {"type": "admin", "message": message };
        records.forEach(function (rec) {
          isendnotifications.push(rec.device_token);
          if(iosids.indexOf(rec.user_id) == -1){
            iosids.push(rec.user_id);
            let notifications = {
              user_id: "0", notify_to: rec.user_id, title: "Admin",
              message: message
            };
            notifyTodevices(notifications);
          }
        });
        senduserios(isendnotifications,message,data);

        UserDevices.find({ device_type: "1" })
        .exec(function (err, records) {
          var asendnotifications = [];
          var androidids=[];
          var message = req.body.message;
          let data = {"type": "admin", "message": message };
          records.forEach(function (rec) {
            asendnotifications.push(rec.device_token);
            if(androidids.indexOf(rec.user_id) == -1 && iosids.indexOf(rec.user_id) == -1){
              androidids.push(rec.user_id);
              let notifications = {
                user_id: "0", notify_to: rec.user_id, title: "Admin",
                message: message
              };
              notifyTodevices(notifications);
            }

          });
          senduserandroid(asendnotifications,message,data);
        });
      });

    }
    else if (req.body.user == 1) {
      DriverDevices.find({ device_type: "0" })
      .exec(function (err, records) {
        var disendnotifications = [];
        var iosids=[];
        var message = req.body.message;
        let data = {"type": "admin", "message": message };
        records.forEach(function (drecords) {
          disendnotifications.push(drecords.device_token);
          if(iosids.indexOf(drecords.user_id) == -1){
            iosids.push(drecords.user_id);
            let drivernotifications = {
              user_id: "0", notify_to: drecords.user_id, title: "Admin",
              message: message
            };
            notifyTodrivers(drivernotifications);
          }
        });
        console.log('iosids' +iosids);

        senddriverios(disendnotifications, message,data);

        DriverDevices.find({ device_type: "1" })
        .exec(function (err, records) {
          var dasendnotifications = [];
          var androidids=[];
          var message = req.body.message;
          let data = {"type": "admin", "message": message };
          records.forEach(function (driverrec) {
            dasendnotifications.push(driverrec.device_token);
            if(androidids.indexOf(driverrec.user_id) == -1 && iosids.indexOf(driverrec.user_id) == -1){
              androidids.push(driverrec.user_id);
              let usernotifications = {
                user_id: "0", notify_to: driverrec.user_id, title: "Admin",
                message: message
              };
              notifyTodrivers(usernotifications);
            }

          });
          console.log('androidids' +androidids);
          senddriverandroid(dasendnotifications,message,data);
        });

      });

    }
  });


  /* firebase ios cloud messaging */
  senduserios = function (devicetokens, messagetext, data) {
  //let serverKey = 'AAAA5_p6ozU:APA91bGmhsz18v3-MTysvcsx7wx5T-EnnFXknd88BgUDnnZp6xLugzFn7e5Pw9orQXXyTgLhQ6wEzaCTRUczCj3z1q7aCeWSfP-vxpo-9luVt_3wJ4OMQLC9d3YDuJxXd8SFMeYtx_op';
  Admin.findOne(function (err, admin) {
    let serverKey = admin.FCMUserKey;
    let fcm = new FCM(serverKey);
    let message = {
      registration_ids: devicetokens,
      notification: {
        body: messagetext,
        data: data
      },
    };
    fcm.send(message)
    .then(function (response) {
  //console.log("Successfully sent with response: ", response);
})
    .catch(function (err) {
  //console.log(err);
})
  });
};


/* firebase android cloud messaging */
senduserandroid = function (devicetokens, messagetext, data) {
  //let serverKey = 'AAAA5_p6ozU:APA91bGmhsz18v3-MTysvcsx7wx5T-EnnFXknd88BgUDnnZp6xLugzFn7e5Pw9orQXXyTgLhQ6wEzaCTRUczCj3z1q7aCeWSfP-vxpo-9luVt_3wJ4OMQLC9d3YDuJxXd8SFMeYtx_op';
  Admin.findOne(function (err, admin) {
    let serverKey = admin.FCMUserKey;
    let fcm = new FCM(serverKey);
    let message = {
      registration_ids: devicetokens,
      data: data
    };
    fcm.send(message)
    .then(function (response) {
  //console.log("Successfully sent with response: ", response);
})
    .catch(function (err) {
  //console.log(err);
})});
};


/* firebase ios cloud messaging */
senddriverios = function (devicetokens, messagetext, data) {
  Admin.findOne(function (err, admin) {
  //let serverKey = 'AAAA4om0EAc:APA91bHmNtdNedtBaYrpiLnOXZ5NhyG99wumLseFek4TkUH16GMjXhVRY7kO0JjCwsoMxBdyeshg_YINPHfPCui9RLTWFF6vrJITmQGUlMhJ5xO3uP2ewtHuPKscyCTOxcvqWxN5EOAM';
  let serverKey = admin.FCMDriverKey;
  let fcm = new FCM(serverKey);
  let message = {
    registration_ids: devicetokens,
    notification: {
      body: messagetext,
      data: data
    },
  };
  fcm.send(message)
  .then(function (response) {
  //console.log("Successfully sent with response: ", response);
})
  .catch(function (err) {
  //console.log(err);
})
});
};


/* firebase android cloud messaging */
senddriverandroid = function (devicetokens, messagetext, data) {
  //let serverKey = 'AAAA4om0EAc:APA91bHmNtdNedtBaYrpiLnOXZ5NhyG99wumLseFek4TkUH16GMjXhVRY7kO0JjCwsoMxBdyeshg_YINPHfPCui9RLTWFF6vrJITmQGUlMhJ5xO3uP2ewtHuPKscyCTOxcvqWxN5EOAM';
  Admin.findOne(function (err, admin) {
    let serverKey = admin.FCMDriverKey;
    let fcm = new FCM(serverKey);
    let message = {
      registration_ids: devicetokens,
      data: data
    };
    fcm.send(message)
    .then(function (response) {
  //console.log("Successfully sent with response: ", response);
})
    .catch(function (err) {
  //console.log(err);
})
  });
};

/* send user notifications */
notifyTodevices = function (notifications) {
  notifications.notified_at = timeZoneadmin();
  let newNotifications = new Notifications(notifications);
  newNotifications.save();
};


/* send user notifications */
notifyTodrivers = function (notifications) {
  notifications.notified_at = timeZoneadmin();
  let newNotifications = new Notifications(notifications);
  newNotifications.save();
};

/* time based on your region */
timeZoneadmin = function () {
  let selectedDate = new Date();
  selectedDate.setHours(selectedDate.getHours() + 5);
  selectedDate.setMinutes(selectedDate.getMinutes() + 30);
  let currentDate = selectedDate;
  let currentTime = currentDate.getTime();
  let localOffset = (-1) * selectedDate.getTimezoneOffset() * 60000;
  let timestamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000);
  return timestamp;
};


module.exports = router;