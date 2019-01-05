  const passport = require('passport');
  const config = require('../database');
  require('../userpassport')(passport);
  const jwt = require('jsonwebtoken');
  const async = require('async');
  const crypto = require('crypto');
  const randomstring = require("randomstring");
  const express = require('express');
  const router = express.Router();
  const path = require('path');
  const FCM = require('fcm-push');
  const googledistance = require('google-distance');
  /* image downloader */
  const download = require('image-downloader');
  /* cron */
  const cron = require('node-cron');

  /* baseurl */
  const base_url = 'http://localhost:3000';

  /** schemas */
  let User = require("../schema/user");
  let Help = require("../models/helppage");
  let Notifications = require("../schema/notification");
  let UserDevices = require("../schema/userdevices");
  let Rides = require("../schema/rides");
  let Commissions = require("../schema/commissions");
  let Categories = require("../schema/categories");
  let Driver = require("../schema/driver");
  let Reviews = require("../schema/reviews");
  let Payments = require("../schema/payments");
  let Wallet = require("../schema/wallets");
  let DriverDevices = require("../schema/driverdevices");
  let Vehicles = require("../schema/vehicles");
  let Admin = require("../models/admin");

  /* upload directories */
  const userassets = "./src/assets/media/users/";
  const categoryassets = "./src/assets/uploads";

  /* image upload functionality*/
  const fs = require('fs');
  const multer = require('multer');
  const upload = multer();

  /* mailer */
  const nodemailer = require('nodemailer');

  /* braintree setting */
  const braintree = require("braintree");

  /* signup as user */
  router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
      senderr(res);
    } else {
      User.count({ email: req.body.email }, function (err, count) {
        if (count > 0) {
          res.json({ status: "false", message: 'Email already exists' });
        }
        else {
          let imagename = crypto.randomBytes(6).toString('hex') + '.jpeg';
          if (typeof req.body.imageurl != 'undefined') {
            req.body.profile_image = imagename;
          }
          let newUser = new User(req.body);
          newUser.save(function (err) {
            if (err) {
              senderr(res);
            }
            else {
              if (typeof req.body.imageurl != 'undefined') {
                let options = {
                  url: req.body.imageurl,
                  dest: userassets + imagename
                }
                download.image(options)
                .then(({ filename, image }) => {
                  res.json({ status: "true", message: 'Your account has been created, please login to your account.' });
                }).catch((err) => {
                  senderr(res);
                })
              }
              else {
                res.json({ status: "true", message: 'Your account has been created, please login to your account.' });
              }
            }
          });
        }
      });
    }
  });

  /* signin as user */
  router.post('/signin', function (req, res) {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (!user) {
        //console.log(err);
        res.json({ status: "false", message: 'Not registered' });
      }
      else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            /* authenticate with token */
            let signintoken = jwt.sign(user.toObject(), config.secret);
            if (typeof req.body.country_code != 'undefined' && typeof req.body.phone_number != 'undefined') {
              /* save the otp details */
              user.country_code = req.body.country_code;
              user.phone_number = req.body.phone_number;
              user.save();
            }
            let profile_image = user.profile_image;
            if (typeof user.profile_image == 'undefined') {
              let profile_image = 'user.png';
            }
            let walletamount=Math.round(user.walletmoney * 100) / 100;
            let result = { status: "true", user_id: user._id, full_name: user.full_name, email: user.email, password: req.body.password, country_code: user.country_code, phone_number: user.phone_number, user_image: base_url + '/gallery/users/' + profile_image, token: 'JWT ' + signintoken, emergency_contact: user.emergency_contact, walletmoney: walletamount };
            res.json(result);
          } else {
            res.json({ status: "false", message: 'Incorrect username or password' });
          }
        });
      }
    });
  });

  /* user profile */
  router.get('/profile/:userid', passport.authenticate('jwt', { session: false }), function (req, res) {
    let token = getToken(req.headers);
    if (token) {
      User.findOne({
        _id: req.params.userid
      }, function (err, user) {
        if (err) throw err;
        if (!user) {
          res.json({ status: "false", message: 'No users found.' });
        } else {
          let profile_image = user.profile_image;
          if (typeof user.profile_image == 'undefined') {
            let profile_image = 'user.png';
          }
          let result = {};
          result.status = "true";
          result.user_id = user._id;
          result.full_name = user.full_name;
          result.email = user.email;
          result.user_image = base_url + '/gallery/users/' + profile_image;
          result.country_code = user.country_code;
          result.phone_number = user.phone_number;
          result.invite_url = "URL";
          result.walletmoney = 0;
          if (typeof user.walletmoney != "undefined" && user.walletmoney != null) {
            result.walletmoney = Math.round(user.walletmoney * 100) / 100;
          }
          result.emergency_contact = user.emergency_contact;
          res.json(result);
        }
      });
    } else {
      senderr(res);
    }
  });

  /* help pages */
  router.get('/helppages', function (req, res) {
    Help.count(function (err, count) {
      if (err) senderr(res);
      else {
        Help.find({ type: "user" }, function (err, helps) {
          if (!err) { res.json({ status: "true", result: helps }); }
          else {
            senderr(res);
          }
        });
      }
    });
  });


  /* notifications */
  router.get('/notifications/:userid', passport.authenticate('jwt', { session: false }), function (req, res) {
    Notifications.count({ notify_to: req.params.userid }, function (err, count) {
      if (count > 0) {
        Notifications.find({ notify_to: req.params.userid }).sort({ '_id': -1 }).
        exec(function (err, notifications) {
          if (!err) { res.json({ status: "true", result: notifications }); }
          else {
            senderr(res);
          }
        });
      }
      else {
        res.json({ status: "false", message: 'No notifications found' });
      }
    });
  });


  /* reset password */
  router.post('/resetpassword', function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(8, function (err, buf) {
          let token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            res.json({ status: "false", message: 'No account with that email address exists.' });
          }
          else {
            user.password = token;
            user.save(function (err) {
              let mailOptions = {
    to: req.body.email, // list of receivers
    subject: 'Password Changed !', // Subject line
    html: 'Your new password : ' + token  // html body
  };

  Admin.findOne(function (err, admin) {
    let transporter = nodemailer.createTransport({
      host: admin.smptHost,
      port: admin.smtpPort,
      secure: false,
      auth: {
        user: admin.smtpUsername,
        pass: admin.smtpPassword
      }
    });
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        senderr(res);
      }
      else {
        res.json({ status: "true", message: 'Your Password has been reset successfully. Kindly check your registered mail now' });
      }
    });

  });
});
          }
        });
      },
      ], function (err) {
        if (err) {
          senderr(res);
        }
      });
  });

  /* upload user profile image */
  let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, userassets)
    },
    filename: function (req, file, callback) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return callback(err);
        callback(null, raw.toString('hex') + path.extname(file.originalname));
      });
    }
  })

  router.post('/uploadprofileimage', passport.authenticate('jwt', { session: false }), function (req, res) {
    let upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return callback(res.end('Only images are allowed'), null)
        }
        callback(null, true)
      }
    }).single('userImage');
    upload(req, res, function (err) {
      User.findOne({ _id: req.body.user_id }, function (err, user) {
        if (user && typeof user.profile_image != 'undefined') {
          fs.unlink(userassets + user.profile_image, function (error) {
            if (error) {
  //console.log(err);
  senderr(res);
}
});
        }
        user.profile_image = res.req.file.filename;
        user.save();
        res.json({ status: "true", user_image: base_url + '/gallery/users/' + res.req.file.filename, message: 'Image uploaded successfully' });
      });
    })
  });


  /* change password */
  router.post('/changepassword', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.newpassword) {
      senderr(res);
    } else {
      User.findOne({ _id: req.body.user_id }, function (err, user) {
        if (!user) {
          senderr(res);
        }
        user.password = req.body.newpassword;
        user.save(function (err) {
          res.json({ status: "true", message: 'Password changed successfully' });
        });
      });
    }
  });


  /* register a user device */
  router.post('/pushsignin', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.device_token || !req.body.device_type || !req.body.device_id) {
      senderr(res);
    } else {
      UserDevices.count({ device_id: req.body.device_id }, function (err, count) {
        if (count > 0) {
          UserDevices.findOneAndUpdate({ device_id: req.body.device_id }, { "$set": req.body }).exec(function (err, userdevices) {
            if (err) {
              senderr(res);
            } else {
              res.json({ status: "true", message: 'Registered successfully' });
            }
          });
        }
        else {
          let newDevices = new UserDevices(req.body);
          newDevices.save();
          res.json({ status: "true", message: 'Registered successfully' });
        }
      });
    }
  });


  /* unregister a user device */
  router.delete('/pushsignout', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.device_id) {
      senderr(res);
    } else {
      UserDevices.count({ device_id: req.body.device_id }, function (err, count) {
        if (count > 0) {
          UserDevices.findOneAndRemove({ device_id: req.body.device_id }, function (err, count) {
            res.json({ status: "true", message: 'Unregistered successfully' });
          });
        }
        else {
          senderr(res);
        }
      });
    }
  });

  /* Available rides */
  router.post('/grabrides', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.pickup_location || !req.body.pickup_lat || !req.body.pickup_lng || !req.body.drop_location || !req.body.drop_lat || !req.body.drop_lng || !req.body.distance) {
      senderr(res);
    } else {
      Admin.findOne(function (err, admin) {
        /* maximum distance coverage */
        let distance = parseFloat(req.body.distance).toFixed(2);
        let maxdistcoverage = parseInt(admin.distancePerCab);
        let maxdisperride = parseInt(admin.maxdisperride);
        if (distance > maxdisperride) {
          res.json({ status: "false", message: 'Sorry! Service not available in this location' });
        }
        else {
          let lon = parseFloat(req.body.pickup_lng);
          let lat = parseFloat(req.body.pickup_lat);
          /* mongo geonear api */
          let query = Driver.aggregate([
          {
            "$geoNear": {
              "near": { "type": "Point", "coordinates": [lon, lat] },
              "maxDistance": maxdistcoverage * 1000,
              "spherical": true,
              "distanceField": "distance",
              "query": { "live_status": "1", "approval": "1" },
            }
          },
          {
            "$group": {
              "_id": "$category_id",
              "distance": { "$first": "$distance" },
              "email": { "$first": "$email" },
              "instant_location": { "$first": "$instant_location" },
            }
          },
          { "$sort": { "distance": 1 } },

          ]);
          query.exec(function (err, driver) {
            if (err) {
              senderr(res);
            }
            else {
  //console.log(driver);
  if (driver.length == '0') {
    res.json({ status: "false", message: 'Sorry! Service not available in this location' });
  } else {
    let availcat = [];
    let distbycat = [];
    let instanthere = []; /* drivers instant location array  */
    for (let k = 0; k < driver.length; k++) {
      let driverId = driver[k]._id;
      let instant = driver[k].instant_location;
      if (driverId != null) {
        availcat.push(driverId);
      }
      distbycat[driverId] = distance;
      instanthere.push(instant);
    }
    if (availcat.length > 0) {
      Categories.find()
      .where('_id')
      .in(availcat)
      .exec(function (err, categories) {
        if (!err) {
          let available_rides = [];
          let categoryresult = {};
          Commissions.find().exec(function (err, results) {
            categories.forEach(function (c) {
              let fareamount = totalFare(c, distbycat, admin.maxDistance);
              let commissionamount = 0, approxprice = 0;
              let resultcount = results.length;
              if (resultcount > 0) {
                results.forEach(function (d) {
                  let dprice_from = parseFloat(d.price_from);
                  let dprice_to = parseFloat(d.price_to);
                  if (fareamount >= dprice_from && fareamount <= dprice_to) {
                    commissionamount = parseFloat(fareamount) * (d.percentage / 100);
                  }
                });
              }
              approxprice = parseFloat(fareamount) + parseFloat(commissionamount);
              let profile_image = c.image;
              if (typeof profile_image == 'undefined') {
                let profile_image = 'category.png';
              }
              let categoryimage = base_url + '/imagegallery/' + profile_image;
                let basePrice=Math.round(approxprice * 100) / 100; // rounded base price
                available_rides.push({
                  _id: c._id,
                  category_name: c.category_name,
                  image: categoryimage,
                  baseprice: basePrice,
                  reach_pickup: '-'
                });
              });
            /* googleapi to calculate distance */
            let googleapi = googledistance.get(
            {
              origins: instanthere,
              destinations: [req.body.pickup_location]
            },
            function (err, data) {
              if (!err) {
                let durationdetails = JSON.parse(JSON.stringify(data));
                for (let s = 0; s < durationdetails.length; s++) {
                  available_rides[s].reach_pickup = durationdetails[s].duration;
                }
                categoryresult.status = "true";
                categoryresult.available_ride = available_rides;
                res.json(categoryresult);
              }
              else {
                res.json({ status: "false", message: 'Sorry! Service not available at this moment' });
              }
            });
          });
        }
        else {
          senderr(res);
        }
      });
    }
    else {
      res.json({ status: "false", message: 'Sorry! Service not available at this moment' });
    }
  }
}
});
        }
      });
}
});

  /* request a ride */
  router.post('/requestride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.category_id || !req.body.payment_type || !req.body.type || !req.body.pickup_location || !req.body.pickup_lat || !req.body.pickup_lng || !req.body.drop_location || !req.body.drop_lat || !req.body.drop_lng) {
      senderr(res);
    } else {
      let timestamp = timeZone();
      let randomnumber = randomstring.generate({
        length: 4,
        charset: 'numeric'
      });
      let taxamount = 0, commissionamount = 0;
      req.body.onride_otp = randomnumber.substr(0, 4);
      if (req.body.type == "schedule") {
        req.body.ridestatus = "scheduled";
      }
      else {
        req.body.ridestatus = "requested";
      }
      req.body.ridestatusat = timestamp;
      let newRides = new Rides(req.body);
      newRides.save(function (err, rides) {
        if (!err) {
          res.json({ status: "true", onride_id: newRides._id, onride_type: newRides.type });
        }
        else {
          senderr(res);
        }
      });
    }
  });

  /* confirm a ride */
  router.post('/confirmride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id, user_id: req.body.user_id };
      let rideresult = {};
      Rides.findOne(querystring).populate('driver_id').
      exec(function (err, rides) {
        if (!err) {
          if ((rides.ridestatus == 'ontheway') || (rides.ridestatus == 'accepted')) {
            rideresult.status = "true";
            rideresult.pickup_location = rides.pickup_location;
            rideresult.pickup_lat = rides.pickup_lat;
            rideresult.pickup_lng = rides.pickup_lng;
            rideresult.drop_location = rides.drop_location;
            rideresult.drop_lat = rides.drop_lat;
            rideresult.drop_lng = rides.drop_lng;
            rideresult.onride_otp = rides.onride_otp;
            rideresult.driver_name = rides.driver_id.full_name;
            if (typeof rides.driver_id.rating == 'undefined') {
              rides.driver_id.rating = "0";
            }
            let querystring = { driver_id: rides.driver_id._id };
            rideresult.driver_mobile = rides.driver_id.phone_number;
            rideresult.driver_id = rides.driver_id.batch_id;
            rideresult.driver_image = base_url + '/gallery/drivers/' + rides.driver_id.profile_image;
            Vehicles.findOne({ user_id: rides.driver_id._id }, function (err, vehicles) {
              if (!err) {
                rideresult.driver_vehicle = vehicles.vehicle_name
                rideresult.driver_vehicleno = vehicles.vehicle_number;
                let userids = [req.body.user_id];
                let message = "Your ride has been accepted. Kindly contact your driver";
                let data = { "ride_id": rides._id, "type": "acceptride", "message": message };
                userNotify(userids, message, data);
                Reviews.count(querystring, function (err, count) {
                  if (count > 0) {
                    rideresult.driver_rating = parseFloat(rides.driver_id.rating / count).toFixed(1);
                    res.json(rideresult);
                  }
                  else {
                    rideresult.driver_rating = "0";
                    res.json(rideresult);
                  }
                });
              }
              else {
                senderr(res);
              }
            });
          }
          else if (rides.ridestatus == 'scheduled') {
            res.json({ status: "true", message: "Your ride has been successfully scheduled" });
          }
          else {
            /* notify nearby drivers */
            let lon = parseFloat(rides.pickup_lng);
            let lat = parseFloat(rides.pickup_lat);
            Admin.findOne(function (err, admin) {
              let maxdistcoverage = parseInt(admin.maxDistance);
              /* mongo geonear api */
              let query = Driver.aggregate([
              {
                "$geoNear": {
                  "near": { "type": "Point", "coordinates": [lon, lat] },
                  "maxDistance": maxdistcoverage * 1000,
                  "spherical": true,
                  "distanceField": "distance",
                  "query": { "live_status": "1", "approval": "1", "category_id": rides.category_id },
                }
              },
              { "$sort": { "distance": 1 } },
              ]);

              query.exec(function (err, driver) {
                if (err) {
                  senderr(res);
                }
                else {
                  if (driver.length == '0') {
                    res.json({ status: "false", message: "Sorry! No Driver found nearby at this moment" });
                  } else {
                    let availdrivers = [];
                    driver.forEach(function (d) {
                      availdrivers.push(d._id);
                    });
                    res.json({ status: "false", message: "Searching" });
                    /* notify nearby drivers */
                    if (rides.notify == 0) {
                      nearBy(availdrivers, rides._id);
                    }
                  }
                }
              });
            });
          }
        }
        else {
          senderr(res);
        }
      });
    }
  });

  cron.schedule('* * * * *', function () {
    /* timestamp */
    let timestamp = scheduletimeZone();
    //console.log("Current time is " + timestamp);
    Rides.find({ ridestatus: 'scheduled', notify: 0 }).where('schedule_time').lt(timestamp).populate('driver_id').
    exec(function (err, schedulerides) {
      schedulerides.forEach(function (rides) {
        /* notify nearby drivers */
        let lon = parseFloat(rides.pickup_lng);
        let lat = parseFloat(rides.pickup_lat);
        Admin.findOne(function (err, admin) {
          let maxdistcoverage = parseInt(admin.maxDistance);
          /* mongo geonear api */
          let query = Driver.aggregate([
          {
            "$geoNear": {
              "near": { "type": "Point", "coordinates": [lon, lat] },
              "maxDistance": maxdistcoverage * 1000,
              "spherical": true,
              "distanceField": "distance",
              "query": { "live_status": "1", "approval": "1", "category_id": rides.category_id },
            }
          },
          { "$sort": { "distance": 1 } },
          ]);
          query.exec(function (err, driver) {
            if (err) {
              senderr(res);
            }
            else {
              if (driver.length > 0) {
                let availdrivers = [];
                driver.forEach(function (d) {
                  availdrivers.push(d._id);
                });
                /* notify nearby drivers */
                if (rides.notify == 0) {
                  schedulenearBy(availdrivers, rides._id);
                }
              }
            }
          });
        });
      });
    });
  });

  /* cancel a ride */
  router.post('/cancelride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let timestamp = timeZone();
      Rides.findOneAndUpdate({ _id: req.body.onride_id }, {
        "$set": {
          ridestatus: "cancelled", ridestatusat: timestamp
        }
      }).exec(function (err, reviews) {
        if (err) {
          senderr(res);
        } else {
          let message = "Your ride has been cancelled.";
  /* let notifications = {
  user_id: "0", notify_to: req.body.user_id, title: "Ride Cancelled",
  message: message
  };
  notifyTo(notifications); */
  /* notify user */
  let userids = [reviews.user_id];
  let data = { "ride_id": reviews._id, "type": "cancelride", "message": message };
  userNotify(userids, message, data);
  if (typeof reviews.driver_id != "undefined" || reviews.driver_id != null) {
    let driverids = [reviews.driver_id];
    driverNotify(driverids, message, data);
  }
  /* notify user */
  res.json({ status: "true", message: message });
}
});
    }
  });


  /* user review a ride */
  router.post('/ridedetails', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id || !req.body.type) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id, ridestatus: req.body.type };
      let rideresult = {};
      Rides.count(querystring, function (err, count) {
        if (count > 0) {
          Rides.findOne(querystring).populate('category_id').
          exec(function (err, rides) {
            if (!err) {
              rideresult.status = "true";
              rideresult.category_name = rides.category_id.category_name;
              let profile_image = rides.category_id.image;
              if (typeof profile_image == 'undefined') {
                let profile_image = 'category.png';
              }
              rideresult.category_image = base_url + '/imagegallery/' + profile_image;
              rideresult.pickup_location = rides.pickup_location;
              rideresult.pickup_lat = rides.pickup_lat;
              rideresult.pickup_lng = rides.pickup_lng;
              rideresult.drop_location = rides.drop_location;
              rideresult.drop_lat = rides.drop_lat;
              rideresult.drop_lng = rides.drop_lng;
              rideresult.approx_price = rides.baseprice;
              res.json(rideresult);
            }
            else {
              senderr(res);
            }
          });
        }
        else {
          senderr(res);
        }
      });
    }
  });

  /* user's rides (or) booking history */
  router.post('/ridehistory', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.type) {
      senderr(res);
    } else {
      let ridestring = [{ ridestatus: 'onride' }, { ridestatus: 'ontheway' }, { ridestatus: 'scheduled' }, { ridestatus: 'accepted' }];
      let rideresult = [], taxprice, statustime;
      if (req.body.type == "history") {
        ridestring = [{ ridestatus: 'cancelled' }, { ridestatus: 'completed' }, { ridestatus: 'scheduleridenotaccepted' }];
      }
      Rides.find({ user_id: req.body.user_id }).or(ridestring).populate('category_id').sort({ '_id': -1 }).
      exec(function (err, rides) {
        if (!err) {
          if (rides.length == '0') {
            res.json({ status: "false", message: 'No rides found' });
          }
          else {
            rides.forEach(function (c) {
              if (typeof c.tax == "undefined" || c.tax == null) {
                taxprice = 0;
              } else {
                taxprice = c.tax;
              }
              if (c.type == "schedule") {
                statustime = parseInt(c.schedule_time);
              }
              else {
                statustime = c.ridestatusat;
              }
              if (typeof c.vehicle_no == "undefined" || c.vehicle_no == null) {
                vehicle_no = "";
              }
              else {
                vehicle_no = c.vehicle_no;
              }
              let profile_image = c.category_id.image;
              if (typeof profile_image == 'undefined') {
                let profile_image = 'category.png';
              }
              let categoryimage = base_url + '/imagegallery/' + profile_image;
              let rideTotal=parseFloat(c.baseprice) + parseFloat(taxprice);
              rideresult.push({
                onride_id: c._id,
                category_image: categoryimage,
                category_name: c.category_id.category_name,
                ride_status: c.ridestatus,
                total_price: Math.round(rideTotal * 100) / 100,
                vehicle_no: vehicle_no,
                pickup_time: statustime
              });
            });
            res.json({ status: "true", result: rideresult });
          }
        }
        else {
          senderr(res);
        }
      });
    }
  });

  /* complete ride details */
  router.post('/completeridedetails', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id, ridestatus: "completed" };
      let rideresult = {};
      Rides.count(querystring, function (err, count) {
        if (count > 0) {
          Rides.findOne(querystring).populate('payment_id').populate('driver_id').populate('user_id').populate('category_id').
          exec(function (err, rides) {
            if (!err) {
              rideresult.status = "true";
              let profile_image = rides.category_id.image;
              if (typeof profile_image == 'undefined') {
                let profile_image = 'category.png';
              }
              rideresult.category_image = base_url + '/imagegallery/' + profile_image;
              rideresult.category_name = rides.category_id.category_name;
              rideresult.username = rides.user_id.full_name;
              rideresult.driver_id = rides.driver_id._id;
              rideresult.pickup_location = rides.pickup_location;
              rideresult.pickup_lat = rides.pickup_lat;
              rideresult.pickup_lng = rides.pickup_lng;
              rideresult.drop_location = rides.drop_location;
              rideresult.drop_lat = rides.drop_lat;
              rideresult.drop_lng = rides.drop_lng;
              rideresult.driver_name = rides.driver_id.full_name;
              rideresult.driver_image = base_url + '/gallery/drivers/' + rides.driver_id.profile_image;
              rideresult.ride_fare = rides.baseprice; /* commission included */
              rideresult.basefare = rides.total; /* commission excluded */
              rideresult.commissionamount = rides.commissionamount;
              rideresult.ride_tax = rides.tax;
              let rideTotal = parseFloat(rides.baseprice) + parseFloat(rides.tax);
              rideresult.ride_total = Math.round(rideTotal * 100) / 100;
              rideresult.payment_type = rides.payment_type;
              rideresult.pickup_time = parseInt(rides.ridestatusat);
              rideresult.walletmoney = 0;
              rideresult.vehicle_no = rides.vehicle_no;
              rideresult.distance = rides.ridedistance;
              rideresult.isreview = "false";
              rideresult.ispayment = "false";
              rideresult.drop_time = rides.ridestatusat;
              rideresult.rideuserid = rides.user_id._id;
              if (typeof rides.user_id.walletmoney != "undefined" && rides.user_id.walletmoney != null) {
                rideresult.walletmoney = Math.round(rides.user_id.walletmoney * 100) / 100;
              }
              Reviews.findOne({ onride_id: req.body.onride_id }).exec(function (err, reviews) {
                if (!reviews) {
                  Payments.findOne({ onride_id: req.body.onride_id }).exec(function (err, payments) {
                    if (!payments) {
                      res.json(rideresult);
                    }
                    else {
                      rideresult.ispayment = "true";
                      res.json(rideresult);
                    }
                  });
                }
                else {
                  rideresult.isreview = "true";
                  rideresult.review_message = reviews.review_message;
                  rideresult.rating = reviews.rating;
                  Payments.findOne({ onride_id: req.body.onride_id }).exec(function (err, payments) {
                    if (!payments) {
                      res.json(rideresult);
                    }
                    else {
                      rideresult.ispayment = "true";
                      res.json(rideresult);
                    }
                  });
                }
              });
            }
            else {
              senderr(res);
            }
          });
        }
        else {
          senderr(res);
        }
      });
    }
  });

  /* get your client token  */
  router.post('/getclienttoken', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id) {
      senderr(res);
    } else {
      User.findOne({
        _id: req.body.user_id
      }, function (err, user) {
        if (typeof user.customer_id != "undefined" && user.customer_id != null) {
          let querystring = { customerId: user.customer_id };
          Admin.findOne(function (err, admin) {
            let gateway = braintree.connect({
              environment: ((admin.BraintreeStatus == '1') ? braintree.Environment.Production : braintree.Environment.Sandbox),
              merchantId: admin.merchandId,
              publicKey: admin.publicKey,
              privateKey: admin.privateKey
            });
            gateway.clientToken.generate(querystring, function (err, response) {
              if (response.success) {
                res.json({ status: "true", clientToken: response.clientToken });
              } else {
                senderr(res);
              }
            });
          });
        } else {
          Admin.findOne(function (err, admin) {
            let gateway = braintree.connect({
              environment: ((admin.BraintreeStatus == '1') ? braintree.Environment.Production : braintree.Environment.Sandbox),
              merchantId: admin.merchandId,
              publicKey: admin.publicKey,
              privateKey: admin.privateKey
            });
            gateway.customer.create({
              firstName: user.full_name,
              email: user.email,
              phone: user.phone_number,
            }, function (err, result) {
              if (result.success) {
                user.customer_id = result.customer.id;
                user.save();
                let querystring = { customerId: result.customer.id };
                gateway.clientToken.generate(querystring, function (err, response) {
                  if (response.success) {
                    res.json({ status: "true", clientToken: response.clientToken });
                  } else {
                    senderr(res);
                  }
                });
              }
              else {
                senderr(res);
              }
            });
          });

        }
      });
    }
  });

  /* pay by card */
  router.post('/paybycard', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.amount || !req.body.paynonce || !req.body.onride_id || !req.body.iswallet || !req.body.basefare || !req.body.commissionamount || !req.body.tax || !req.body.driver_id) {
      senderr(res);
    } else {
      Payments.count({ onride_id: req.body.onride_id }, function (err, count) {
        if (count > 0) {
          res.json({ status: "true", message: 'Payment has been done successfully' });
        }
        else {
          let querystring = { _id: req.body.user_id }; /* find user details by userid */
          Admin.findOne(function (err, admin) {
            User.findOne(querystring).exec().then(function (err, user) {
              let gateway = braintree.connect({
                environment: ((admin.BraintreeStatus == '1') ? braintree.Environment.Production : braintree.Environment.Sandbox),
                merchantId: admin.merchandId,
                publicKey: admin.publicKey,
                privateKey: admin.privateKey
              });
              gateway.transaction.sale({
                amount: req.body.amount,
                paymentMethodNonce: req.body.paynonce,
                options: {
                  submitForSettlement: true
                }
              }, function (err, result) {
                if (!err) {
                  if (result.success) {
                    let payObject = {
                      user_id: req.body.user_id, onride_id: req.body.onride_id, payment_type: "card",
                      ride_fare: result.transaction.amount, transaction_id: result.transaction.id,baseprice: req.body.basefare, commissionamount: req.body.commissionamount, tax: req.body.tax,
                      driver_id: req.body.driver_id
                    };
                    let newPayment = new Payments(payObject);
                    newPayment.save(function (err) {
                      if (!err) {
                        if (req.body.iswallet == "1") {
                          let paywalletObject = {
                            user_id: req.body.user_id, onride_id: req.body.onride_id,
                            amount: req.body.walletamount, type: "debit", transaction: "payride", updated_at: timeZone()
                          };
                          let newWallet = new Wallet(paywalletObject);
                          newWallet.save(function (err) {
                            if (!err) {
                              User.update({ "_id": req.body.user_id },
                                { "$inc": { "walletmoney": -req.body.walletamount } }, { new: true }, function (err, doc) {
                                  if (!err) {
                                    let walletamount;
                                    if (typeof doc.walletmoney != 'undefined') {
                                      walletamount = Math.round(doc.walletmoney * 100) / 100;
                                    }
                                    else {
                                      walletamount = 0;
                                    }
                                    let message = "Payment has been done successfully";
                                    let notifications = {
                                      user_id: "0", notify_to: req.body.user_id, title: "Payment Completed",
                                      message: message
                                    };
                                    notifyTo(notifications);
                                    Rides.findOne({
                                      _id: req.body.onride_id
                                    }, function (err, rides) {
                                      if (!rides) {
                                        senderr(res);
                                      }
                                      else {
                                        let userids = [req.body.user_id];
                                        let driverids = [rides.driver_id];
                                        let data = { "type": "payment", "message": message, "ride_id": rides._id };
                                        let drivernotifications = {
                                          user_id: "0", notify_to: rides.driver_id, title: "Payment Completed",
                                          message: message
                                        };
                                        notifyTo(drivernotifications);
                                        userNotify(userids, message, data);
                                        driverNotify(driverids, message, data);
                                        res.json({ status: "true", walletmoney: walletamount, message: message });
                                      }
                                    });
                                  }
                                  else {
                                    senderr(res);
                                  }
                                });
                            }
                            else {
                              senderr(res);
                            }
                          });
                        }
                        else {
                          let message = "Payment has been done successfully";
                          let notifications = {
                            user_id: "0", notify_to: req.body.user_id, title: "Payment Completed",
                            message: message
                          };
                          notifyTo(notifications);
                          Rides.findOne({
                            _id: req.body.onride_id
                          }, function (err, rides) {
                            if (!rides) {
                              senderr(res);
                            }
                            else {
                              let userids = [req.body.user_id];
                              let driverids = [rides.driver_id];
                              let data = { "type": "payment", "message": message, "ride_id": rides._id };
                              let drivernotifications = {
                                user_id: "0", notify_to: rides.driver_id, title: "Payment Completed",
                                message: message
                              };
                              notifyTo(drivernotifications);
                              userNotify(userids, message, data);
                              driverNotify(driverids, message, data);
                              res.json({ status: "true", message: message });
                            }
                          });
                        }
                      }
                      else {
                        senderr(res);
                      }
                    });
} else {
  senderr(res);
}
}
else { senderr(res); }
});
});
}).then(undefined, function (err) {
  senderr(res);
})
}});}
});


  /* pay by cash or wallet */
  router.post('/paybycash', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.amount || !req.body.onride_id || !req.body.iswallet || !req.body.basefare || !req.body.commissionamount || !req.body.tax || !req.body.driver_id) {
      senderr(res);
    } else {
      let paidby = "cash";
      if (req.body.amount == 0) {
        paidby = "wallet";
      }
      Payments.count({ onride_id: req.body.onride_id }, function (err, count) {
        if (count > 0) {
          res.json({ status: "true", message: 'Payment has been done successfully' });
        }
        else {
          let payObject = {
            user_id: req.body.user_id, onride_id: req.body.onride_id, payment_type: paidby,
            ride_fare: req.body.amount, baseprice: req.body.basefare, commissionamount: req.body.commissionamount, tax: req.body.tax,
            driver_id: req.body.driver_id,paidbywallet:req.body.walletamount
          };
          let newPayment = new Payments(payObject);
          newPayment.save(function (err) {
            if (!err) {
              if (req.body.iswallet == "1") {
                let paywalletObject = {
                  user_id: req.body.user_id, onride_id: req.body.onride_id,
                  amount: req.body.walletamount, type: "debit", transaction: "payride", updated_at: timeZone()
                };
                let newWallet = new Wallet(paywalletObject);
                newWallet.save(function (err) {
                  if (!err) {
                    User.findOneAndUpdate({ "_id": req.body.user_id },
                      { "$inc": { "walletmoney": -req.body.walletamount } }, { new: true }, function (err, doc) {
                        if (!err) {
                          let walletamount;
                          if (typeof doc.walletmoney != 'undefined') {
                            walletamount =Math.round(doc.walletmoney * 100) / 100;
                          }
                          else {
                            walletamount = 0;
                          }
                          let message = "Payment has been done successfully";
                          let notifications = {
                            user_id: "0", notify_to: req.body.user_id, title: "Payment Completed",
                            message: message
                          };
                          notifyTo(notifications);
                          Rides.findOne({
                            _id: req.body.onride_id
                          }, function (err, rides) {
                            if (!rides) {
                              senderr(res);
                            }
                            else {
                              let userids = [req.body.user_id];
                              let driverids = [rides.driver_id];
                              let data = { "type": "payment", "message": message, "ride_id": rides._id };
                              let drivernotifications = {
                                user_id: "0", notify_to: rides.driver_id, title: "Payment Completed",
                                message: message
                              };
                              notifyTo(drivernotifications);
                              userNotify(userids, message, data);
                              driverNotify(driverids, message, data);
                              res.json({ status: "true", walletmoney: walletamount, message: message });
                            }
                          });
                        }
                        else {
                          senderr(res);
                        }
                      });
                  }
                  else {
                    senderr(res);
                  }
                });
              }
              else {
                let message = "Payment has been done successfully";
                let notifications = {
                  user_id: "0", notify_to: req.body.user_id, title: "Payment Completed",
                  message: message
                };
                notifyTo(notifications);
                Rides.findOne({
                  _id: req.body.onride_id
                }, function (err, rides) {
                  if (!rides) {
                    senderr(res);
                  }
                  else {
                    let userids = [req.body.user_id];
                    let driverids = [rides.driver_id];
                    let data = { "type": "payment", "message": message, "ride_id": rides._id };
                    let drivernotifications = {
                      user_id: "0", notify_to: rides.driver_id, title: "Payment Completed",
                      message: message
                    };
                    notifyTo(drivernotifications);
                    userNotify(userids, message, data);
                    driverNotify(driverids, message, data);
                    res.json({ status: "true", message: message });
                  }
                });
              }
            }
            else {
              senderr(res);
            }
          });
}
});
}
});

  /* add money to wallet */
  router.post('/addmoney', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.amount || !req.body.paynonce) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.user_id }; /* find user details by userid */
      Admin.findOne(function (err, admin) {
        let gateway = braintree.connect({
          environment: ((admin.BraintreeStatus == '1') ? braintree.Environment.Production : braintree.Environment.Sandbox),
          merchantId: admin.merchandId,
          publicKey: admin.publicKey,
          privateKey: admin.privateKey
        });
        User.findOne(querystring).exec().then(function (err, user) {
          gateway.transaction.sale({
            amount: req.body.amount,
            paymentMethodNonce: req.body.paynonce,
            options: {
              submitForSettlement: true
            }
          }, function (err, result) {
            if (!err) {
              if (result.success) {
                let payObject = {
                  user_id: req.body.user_id,
                  amount: result.transaction.amount, transaction_id: result.transaction.id, type: "credit", transaction: "addmoney", updated_at: timeZone()
                };
                let newWallet = new Wallet(payObject);
                newWallet.save(function (err) {
                  if (!err) {
                    User.findOneAndUpdate({ "_id": req.body.user_id },
                      { "$inc": { "walletmoney": result.transaction.amount }, }, { new: true }, function (err, doc) {
                        if (!err) {
                          let message = "Amount credited to your wallet successfully";
                          let walletamount =Math.round(doc.walletmoney * 100) / 100;
                          let notifications = {
                            user_id: "0", notify_to: req.body.user_id, title: "Wallet Credited",
                            message: "Your wallet has been credited & wallet balance is " + walletamount
                          };
                          notifyTo(notifications);
                          let userids = [req.body.user_id];
                          let data = { "type": "payment", "message": message };
                          userNotify(userids, "Your wallet has been credited & wallet balance is", data);
                          res.json({ status: "true", walletmoney: walletamount, message: message });
                        }
                        else {
                          senderr(res);
                        }
                      });
                  }
                  else {
                    senderr(res);
                  }
                });
              } else {
                senderr(res);
              }
            }
            else { senderr(res); }
          });
        });
      }).then(undefined, function (err) {
        senderr(res);
      })
    }
  });


  /* wallet history */
  router.get('/wallethistory/:userid', passport.authenticate('jwt', { session: false }), function (req, res) {
    Wallet.count(function (err, count) {
      if (err) senderr(res);
      else {
        if (count > 0) {
          Wallet.find({ user_id: req.params.userid }).sort([['_id', -1]]).exec(function (err, wallets) {
            if (!err) {
              res.json({ status: "true", payment_list: wallets });
            }
            else {
              senderr(res);
            }
          });
        }
        else {
          res.json({ status: "false", message: 'No Wallet used' });
        }
      }
    });
  });


  /* user review a ride */
  router.post('/review', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id, user_id: req.body.user_id };
      Reviews.count({ onride_id: req.body.onride_id }, function (err, count) {
        if (count > 0) {
          Reviews.findOneAndUpdate({ onride_id: req.body.onride_id, }, {
            "$set": {
              review_message: req.body.review_message,
              rating: req.body.rating
            }
          }).exec(function (err, reviews) {
            if (err) {
              senderr(res);
            } else {
              let query = Reviews.aggregate([
              {
                $match: {
                  driver_id: reviews.driver_id
                }
              },
              {
                $group: {
                  _id: 'null',
                  ratings: { $sum: "$rating" },
                }
              }
              ]);

              query.exec(function (err, driver) {
                if (err) {
                  senderr(res);
                } else {
                  let rating = parseInt(driver[0].ratings);
                  let updateresult = { rating: rating };
                  Driver.findOneAndUpdate({ "_id": reviews.driver_id }, { "$set": updateresult }).exec(function (err, drivers) {
                    if (err) {
                      senderr(res);
                    } else {
                      res.json({ status: "true", message: 'Review Updated Successfully' });
                    }
                  });
                }
              });
            }
          });
        }
        else {
          Rides.findOne(querystring).
          exec(function (err, rides) {
            if (!err) {
              let reviewObject = {
                user_id: req.body.user_id, onride_id: req.body.onride_id, review_message: req.body.review_message,
                rating: req.body.rating, driver_id: rides.driver_id
              };
              let newReview = new Reviews(reviewObject);
              newReview.save(function (err, reviews) {
                if (!err) {
                  if (req.body.rating == null) {
                    req.body.rating = 0;
                  }
                  Driver.update({ "_id": rides.driver_id },
                    { "$inc": { "rating": req.body.rating } }, { new: true }, function (err, doc) {
                      if (!err) {
                        res.json({ status: "true", message: 'Review Updated Successfully' });
                      }
                      else {
                        senderr(res);
                      }
                    });
                }
                else {
                  senderr(res);
                }
              });
            }
            else {
              senderr(res);
            }
          });
        }
      });
    }
  });

  /** message & contact admin */
  router.post('/contactus', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.name || !req.body.email || !req.body.subject || !req.body.message) {
      senderr(res);
    } else {
      Admin.findOne(function (err, admin) {
        let message = "Mail From: " + req.body.email;
        let mailOptions = {
          to: admin.email,
          subject: req.body.subject,
          html: '<i>Mail From ' + req.body.name + '</i>' + '<br />' + req.body.message +
          '<br /><br />' + 'you can contact him at this mail id ' + req.body.email,
        };

        let transporter = nodemailer.createTransport({
          host: admin.smptHost,
          port: admin.smtpPort,
          secure: false,
          auth: {
            user: admin.smtpUsername,
            pass: admin.smtpPassword
          }
        });
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      senderr(res);
    }
    else {
      res.json({ status: "true", message: "Got your query. We will get back to you soon" });
    }
  });
});
    }
  });

  /* edit name & edit country_code  & emergency contact*/
  router.post('/updateprofile', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id) {
      senderr(res);
    } else {
      if (typeof req.body.emergency_contact != 'undefined') {
        req.body.emergency_contact = JSON.parse(req.body.emergency_contact);
      }
      User.findOneAndUpdate({ _id: req.body.user_id }, { "$set": req.body }).exec(function (err, users) {
        if (err) {
          senderr(res);
        } else {
          res.json({ status: "true", message: 'User updated successfully' });
        }
      });
    }
  });

  router.get('/admindatas', function (req, res, next) {
    Admin.findOne(function (err, admin) {
      res.json({ status: "true", currencycode: admin.currencyCode, currencysymbol: admin.currencySymbol, emergencycontact: admin.emergencyContact });
    });
  });

  /* on ride not accepted */
  router.post('/nooneaccept', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id };
      Rides.findOne(querystring).populate('user_id').
      exec(function (err, rides) {
        if (!rides) {
          senderr(res);
        } else {
          rides.ridestatus = "ridenotaccepted";
          rides.ridestatusat = timeZone();
          rides.save();
          res.json({ status: "true", message: "Status changed successfully" });
        }
      });
    }
  });


  /* fare calculation based on distance */
  totalFare = function (c, distbycat, maxdistancecab) {
    let categoryId = c._id;
    let maxdistancepercab = parseFloat(maxdistancecab);
    let distancebykm = parseFloat(distbycat[categoryId]).toFixed(2);
    let categorybase = parseFloat(c.baseprice);
    let categoryunit = parseFloat(c.unitprice);
    let totalfare, unitfare, unitdistance;
    if (distancebykm > maxdistancepercab) {
      unitdistance = Math.abs(distancebykm - maxdistancepercab);
      unitfare = parseFloat(categoryunit * unitdistance);
      basefare = parseFloat(categorybase);
      totalfare = parseFloat(unitfare + basefare).toFixed(2);
    }
    else {
      totalfare = parseFloat(categorybase).toFixed(2);
    }
    return totalfare;
  };


  /* Pushnotify */
  driverNotify = function (driverIds, message, data) {
    DriverDevices.find({ device_type: "0" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseDriver(sendnotifications, message, data);
    });

    /** ios pushnotifications */
    DriverDevices.find({ device_type: "1" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseAndroidDriver(sendnotifications, message, data);
    });
  };

  /* Pushnotify */
  userNotify = function (driverIds, message, data) {
    UserDevices.find({ device_type: "0" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBase(sendnotifications, message, data);
    });

    /** ios pushnotifications */
    UserDevices.find({ device_type: "1" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseAndroid(sendnotifications, message, data);
    });
  };

  /* notify nearby  drivers*/
  nearBy = function (driverIds, rideId) {
    let message = "New Ride available";
    let data = { "ride_id": rideId, "message": "New Ride available", "type": "nearby" };
    /** android pushnotifications */
    DriverDevices.find({ device_type: "0" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseDriver(sendnotifications, message, data);
    });

    /** ios pushnotifications */
    DriverDevices.find({ device_type: "1" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseAndroidDriver(sendnotifications, message, data);
    });

    Rides.findOneAndUpdate({ _id: rideId }, {
      "$set": {
        notify: 1,
      }
    }).exec(function (err, rides) {
      if (err) {
        senderr(res);
      } else {
  //console.log("notifications updated to nearby drivers");
}
});
  };

  /* notify nearby  drivers*/
  schedulenearBy = function (driverIds, rideId) {
    let message = "New Ride available";
    let data = { "ride_id": rideId, "message": "New Ride available", "type": "nearby" };
    /** android pushnotifications */
    DriverDevices.find({ device_type: "0" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseDriver(sendnotifications, message, data);
    });

    /** ios pushnotifications */
    DriverDevices.find({ device_type: "1" })
    .where('user_id')
    .in(driverIds)
    .exec(function (err, records) {
      let sendnotifications = [];
      records.forEach(function (rec) {
        sendnotifications.push(rec.device_token);
      });
      fireBaseAndroidDriver(sendnotifications, message, data);
    });

    Rides.findOneAndUpdate({ _id: rideId }, {
      "$set": {
        notify: 1,
        ridestatus: "scheduleridenotaccepted"
      }
    }).exec(function (err, rides) {
      if (err) {
        senderr(res);
      } else {
  //console.log("notifications updated to nearby drivers");
}
});
  };

  /* send user notifications */
  notifyTo = function (notifications) {
    notifications.notified_at = timeZone();
    let newNotifications = new Notifications(notifications);
    newNotifications.save();
  };

  /* firebase ios cloud messaging */
  fireBase = function (devicetokens, messagetext, data) {
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
fireBaseAndroid = function (devicetokens, messagetext, data) {
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

/* jwt authentication  */
getToken = function (headers) {
  if (headers && headers.authorization) {
    return headers.authorization;
  } else {
    return null;
  }
};

/* error handlers */
senderr = function (res) {
  return res.json({ status: "false", message: 'Something went to be wrong' });
};


/* firebase ios cloud messaging */
fireBaseDriver = function (devicetokens, messagetext, data) {
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
fireBaseAndroidDriver = function (devicetokens, messagetext, data) {
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

/* time based on your region */
timeZone = function () {
  let selectedDate = new Date();
  selectedDate.setHours(selectedDate.getHours() + 5);
  selectedDate.setMinutes(selectedDate.getMinutes() + 30);
  let currentDate = selectedDate;
  let currentTime = currentDate.getTime();
  let localOffset = (-1) * selectedDate.getTimezoneOffset() * 60000;
  let timestamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000);
  return timestamp;
};


/* schedule time based on your region */
scheduletimeZone = function () {
  let selectedDate = new Date();
  selectedDate.setHours(selectedDate.getHours() + 5);
  selectedDate.setMinutes(selectedDate.getMinutes() + 40);
  let currentDate = selectedDate;
  let currentTime = currentDate.getTime();
  let localOffset = (-1) * selectedDate.getTimezoneOffset() * 60000;
  let timestamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000);
  return timestamp;
};

module.exports = router;