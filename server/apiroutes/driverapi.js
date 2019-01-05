  const passport = require('passport');
  const config = require('../database');
  require('../driverpassport')(passport);
  const jwt = require('jsonwebtoken');
  const async = require('async');
  const express = require('express');
  const router = express.Router();
  const path = require('path');

  /* schemas */
  let Driver = require("../schema/driver");
  let Bodytypes = require("../schema/bodytypes");
  let Amenities = require("../schema/amenities");
  let Vehicles = require("../schema/vehicles");
  let Notifications = require("../schema/notification");
  let Help = require("../models/helppage");
  let Rides = require("../schema/rides");
  let UserDevices = require("../schema/driverdevices");
  let NotifyDevices = require("../schema/userdevices");
  let Payments = require("../schema/payments");
  let Commissions = require("../schema/commissions");
  let Reviews = require("../schema/reviews");
  let Admin = require("../models/admin");
  let Settlements = require("../schema/settlement");



  /* api url */
  const base_url = 'http://localhost:3000';

  /* upload directories */
  const driverassets = "./src/assets/media/drivers/";

  /* image uploads */
  const fs = require('fs');
  const multer = require('multer');
  const upload = multer();

  /* mailers */
  const nodemailer = require('nodemailer');

  /* push notifications */
  const FCM = require('fcm-push');

  /* random string generation */
  const crypto = require('crypto');
  const randomstring = require("randomstring");

  /* signup as driver user */
  router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      let otp = randomstring.generate({
        length: 4,
        charset: 'numeric'
      });
      let BatchId = 'ID ' + otp.substr(0, 4);
      let newDriver = new Driver({
        email: req.body.email,
        password: req.body.password,
        full_name: req.body.full_name,
        country_code: req.body.country_code,
        phone_number: req.body.phone_number,
        lat: req.body.lat,
        lon: req.body.lon,
        loc: [req.body.lon, req.body.lat],
        instant_lat: req.body.lat,
        instant_lng: req.body.lon,
        location: req.body.location,
        vehicle_inspection: "InComplete",
        security_deposit: "InComplete",
        vehicle_details: "InComplete",
        payment_details: "InComplete",
        live_status: "0",
        approval: "0",
        batch_id: BatchId
      });
  // save the driver details  
  newDriver.save(function (err) {
    if (err) {
      res.json({ status: "false", message: 'Email already exists.' });
    }
    else {
      res.json({ status: "true", message: 'Your account has been created, please login to your account.' });
    }
  });
}
});


  /* signin as user */
  router.post('/signin', function (req, res) {
    Driver.findOne({
      email: req.body.email
    }, function (err, driver) {
      if (err) throw err;
      if (!driver) {
        res.json({ status: "false", message: 'Not registered' });
      } else {
  // check if password matches
  driver.comparePassword(req.body.password, function (err, isMatch) {
    if (isMatch && !err) {
  // if driver is found and password is right create a token
  let signintoken = jwt.sign(driver.toObject(), config.secret);
  //save the country_code & phone number
  if (typeof req.body.country_code != 'undefined' && typeof req.body.phone_number != 'undefined') {
    driver.country_code = req.body.country_code;
    driver.phone_number = req.body.phone_number;
    driver.save();
  }
  Vehicles.count({ user_id: driver._id }).exec()
  .then(function (count) {
    if (count == '0') {
      let newVehicle = new Vehicles({
        user_id: driver._id,
        completionStatus: "0"
      });
      newVehicle.save(function (err, vehicles) {
        if (err) {
          senderr(res);
        }
        else {
          driver.vehicle_id = vehicles._id;
          driver.save();
        }
      });
    }
  }).then(function (err) {
    let profile_image = driver.profile_image;
    if (typeof driver.profile_image == 'undefined') {
      let profile_image = 'driver.png';
    }
    let result = {};
    result.status = "true";
    result.user_id = driver._id;
    result.full_name = driver.full_name;
    result.email = driver.email;
    result.password = req.body.password;
    result.country_code = driver.country_code;
    result.phone_number = driver.phone_number;
    result.vehicle_inspection = driver.vehicle_inspection;
    result.security_deposit = driver.security_deposit;
    result.vehicle_details = driver.vehicle_details;
    result.payment_details = driver.payment_details;
    result.user_image = base_url + '/gallery/drivers/' + profile_image;
    result.token = 'JWT ' + signintoken;
    result.emergency_contact = driver.emergency_contact;
    result.approval = ((driver.approval == '1') ? "true" : "false");
    res.json(result);
  })
  .then(undefined, function (err) {
    res.json({ status: "false", message: "Something went to be wrong" });
  })
}
else {
  res.json({ status: "false", message: 'Incorrect username or password' });
}
});
}
});
  });


  /* driver profile */
  router.get('/profile/:userid', passport.authenticate('jwt', { session: false }), function (req, res) {
    let token = getToken(req.headers);
    if (token) {
      Driver.findOne({
        _id: req.params.userid
      }, function (err, driver) {
        if (err) throw err;
        if (!driver) {
          res.json({ status: "false", message: 'No users found.' });
        } else {
          let profile_image = driver.profile_image;
          if (typeof driver.profile_image == 'undefined') {
            let profile_image = 'driver.png';
          }
          let result = {};
          result.status = "true";
          result.user_id = driver._id;
          result.full_name = driver.full_name;
          result.email = driver.email;
          result.user_image = base_url + "/gallery/drivers/" + profile_image;
          result.country_code = driver.country_code;
          result.phone_number = driver.phone_number;
          result.emergency_contact = driver.emergency_contact;
          result.nextinspectionon = driver.inspectionon;
          let querystring = { driver_id: req.params.userid };
          Reviews.count(querystring, function (err, count) {
            if (count > 0) {
              result.rating = parseFloat(driver.rating / count).toFixed(1);
              res.json(result);
            }
            else {
              result.rating = "0";
              res.json(result);
            }
          });
        }
      });
    } else {
      res.json({ status: "false", message: "Something went to be wrong" });
    }
  });


  /* admin datas */
  router.get('/admindatas', function (req, res, next) {
    Bodytypes.find().exec()
    .then(function (bodytypes) {
      let result = [];
      return Amenities.find().exec()
      .then(function (amenities) {
        return [bodytypes, amenities];
      });
    })
    .then(function (result) {
      Help.count(function (err, count) {
        if (err) res.json({ status: "false", message: "Something went to be wrong" });
        else {
          let pagetypes = ['vehicleInspection', 'securityDeposit'];
          let driverdocs = [], currencycode;
          Help.find().where('pagetype')
          .in(pagetypes)
          .exec(function (err, helps) {
            helps.forEach(function (h) {
              driverdocs.push(h);
            });
            if (!err) {
              Admin.findOne(function (err, admin) {
                res.json({ status: "true", body_type: result[0], amenities: result[1], driverdocs: driverdocs, currencycode: admin.currencyCode, currencysymbol: admin.currencySymbol, emergencycontact: admin.emergencyContact });
              });
            }
            else {
              res.json({ status: "false", message: "Something went to be wrong" });
            }
          });
        }
      });
    })
    .then(undefined, function (err) {
      senderr(res);
    })
  });


  /* driver's new cab */
  router.get('/getvehicledetails/:userid', function (req, res) {
    if (!req.params.userid) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      Vehicles.count({ user_id: req.params.userid }).exec()
      .then(function (count) {
        if (count > 0) {
          Vehicles.findOne({ user_id: req.params.userid }, function (err, vehicles) {
            if (!vehicles) {
              res.json({ status: "false", message: "Something went to be wrong" });
            }
            vehicles.status = "true";
            res.json(vehicles);
          });
        }
        else {
          res.json({ status: "false", message: 'No vehicles found.' });
        }
      })
      .then(undefined, function (err) {
        res.json({ status: "false", message: "Something went to be wrong" });
      })
    }
  });


  router.post('/postvehicledetails', function (req, res) {
    if (!req.body.user_id) {
      res.json({ status: "false", message: 'Something went to be wrong' });
    } else {
      Vehicles.count({ user_id: req.body.user_id })
      .then(function (c) {
        req.body.amenities = JSON.parse(req.body.amenities);
        if (c > 0) {
  //update the vehicle details
  Vehicles.findOneAndUpdate({ "user_id": req.body.user_id }, { "$set": req.body }).exec(function (err, vehicles) {
    let result = { vehicle_details: "Complete" };
    if (err) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      Driver.findOneAndUpdate({ _id: req.body.user_id }, { $set: result }).exec(function (err, driver) {
        if (err) {
          res.json({ status: "false", message: "Something went to be wrong" });
        } else {
          let updatestring = { _id: req.body.user_id, vehicle_inspection: "Complete", security_deposit: "Complete", payment_details: "Complete", vehicle_details: "Complete" };
          Driver.find(updatestring).
          exec(function (err, rides) {
            if (!err) {
              vehicles.completionStatus = "1";
              vehicles.save();
              res.json({ status: "true", message: 'Vehicle updated sucessfully' });
            }
            else {
              res.json({ status: "true", message: 'Vehicle updated sucessfully' });
            }
          });
        }
      });
    }
  });
}
else {
  req.body.status = "true";
  let newVehicle = new Vehicles(req.body);
  // save the vehicle details
  newVehicle.save(function (err, vehicles) {
    if (err) {
      res.json({ status: "false", message: 'Something went to be wrong' });
    }
    else {
      let result = { vehicle_details: "Complete" };
      Driver.findOneAndUpdate({ _id: req.body.user_id }, { $set: result }).exec(function (err, driver) {
        if (err) {
          res.json({ status: "false", message: "Something went to be wrong" });
        } else {
          res.json({ status: "true", message: 'Vehicle saved sucessfully' });
        }
      });
    }
  });
}
})
      .then(undefined, function (err) {
        res.json({ status: "false", message: 'Something went to be wrong' });
      })
    }
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
        Driver.findOne({ email: req.body.email }, function (err, driver) {
          if (!driver) {
            res.json({ status: "false", message: 'No account with that email address exists.' });
          }
          else {
            driver.password = token;
            driver.save(function (err) {
              let mailOptions = {
  to: req.body.email, // list of receivers
  subject: 'Password Changed!', // Subject line
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
        if (err) return next(err);
        res.json({ status: "false", message: "Something went to be wrong" });
      });
  });


  /* change password */
  router.post('/changepassword', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.newpassword) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
        if (!driver) {
          res.json({ status: "false", message: "Something went to be wrong" });
        }
        driver.password = req.body.newpassword;
        driver.save(function (err) {
          res.json({ status: "true", message: 'Password changed successfully' });
        });
      });
    }
  });


  /* help pages */
  router.get('/helppages', function (req, res) {
    Help.count(function (err, count) {
      if (err) res.json({ status: "false", message: "Something went to be wrong" });
      else {
        Help.find({ type: "driver", pagetype: { $nin: ['vehicleInspection', 'securityDeposit'] } }, function (err, helps) {
          if (!err) { res.json({ status: "true", result: helps }); }
          else {
            res.json({ status: "false", message: "Something went to be wrong" });
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
            res.json({ status: "false", message: "Something went to be wrong" });
          }
        });
      }
      else {
        res.json({ status: "false", message: 'No notifications found' });
      }
    });
  });


  /* add & edit & delete edit emergency_contact */
  router.post('/updateprofile', function (req, res) {
    if (!req.body.user_id) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      if (typeof req.body.emergency_contact != 'undefined') {
        req.body.emergency_contact = JSON.parse(req.body.emergency_contact);
      }
      Driver.findOneAndUpdate({ _id: req.body.user_id }, { $set: req.body }).exec(function (err, driver) {
        if (err) {
          res.json({ status: "false", message: "Something went to be wrong" });
        } else {
          let updatestring = { _id: req.body.user_id, vehicle_inspection: "Complete", security_deposit: "Complete", payment_details: "Complete", vehicle_details: "Complete" };
          let querystring = { completionStatus: "1" };
          Driver.find(updatestring).
          exec(function (err, drivers) {
            if (!err) {
              Vehicles.findOneAndUpdate({ "user_id": req.body.user_id }, { $set: querystring }).exec(function (err, vehicles) {
                if (err) {
                  senderr(res);
                } else {
                  res.json({ status: "true", message: 'User updated successfully' });
                }
              });
            }
            else {
              res.json({ status: "true", message: 'User updated successfully' });
            }
          });
        }
      });
    }
  });


  /* add & edit & delete edit emergency_contact */
  router.post('/paymentinfo', function (req, res) {
    if (!req.body.user_id || !req.body.type) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
        if (!driver) {
          res.json({ status: "false", message: "Something went to be wrong" });
        }
        let pay = {};
        pay.status = "true";
        if (req.body.type == "cash") {
          pay.type = req.body.type;
        }
        else {
          pay.type = req.body.type;
  pay.routingno = req.body.routing_no; // ABA/Routing number of the receiving bank
  pay.bankaccountno = req.body.bank_ac; // Recipient's bank account number
  pay.name = req.body.name; // Recipient's name (as listed on the account)
  pay.address = req.body.address; //Recipient's address (as listed on the account)
}
driver.payment_account = pay;
driver.payment_details = "Complete";
driver.save(function (err) {
  let updatestring = { _id: req.body.user_id, vehicle_inspection: "Complete", security_deposit: "Complete", payment_details: "Complete", vehicle_details: "Complete" };
  let querystring = { completionStatus: "1" };
  Driver.find(updatestring).
  exec(function (err, drivers) {
    if (!err) {
      Vehicles.findOneAndUpdate({ "user_id": req.body.user_id }, { $set: querystring }).exec(function (err, vehicles) {
        if (err) {
          senderr(res);
        } else {
          res.json(pay);
        }
      });
    }
    else {
      res.json(pay);
    }
  });
});
});
    }
  });

  /* send driver payment details */
  router.get('/paymentinfo/:userid', function (req, res) {
    if (!req.params.userid) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      Driver.findOne({ _id: req.params.userid }, function (err, driver) {
        if (!driver) {
          res.json({ status: "false", message: "Something went to be wrong" });
        }
        else {
          res.json(driver.payment_account);
        }
      });
    }
  });

  /* dashboard for driver */
  router.get('/dashboard/:userid', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.params.userid) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      let reportsummary = {};
      let ridebytoday = 0, ridebymonth = 0;
      let querystring = { driver_id: req.params.userid, ridestatus: "completed" };
      Rides.count(querystring, function (err, count) {
        let ridesstatscount = count;
        let total_earning = 0;
        /* today starts at */
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let todaystarts = start.toISOString();
        /* today ends at */
        let end = new Date();
        let thisyear = (new Date()).getFullYear();
        end.setHours(23, 59, 59, 999);
        let todayends = end.toISOString();
        let startmonth = new Date(start.getFullYear(), start.getMonth(), 1);
        let endmonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        let monthstarts = startmonth.toISOString();
        let monthends = endmonth.toISOString();
        let settledamount=0.0;
        if (count > 0) {
          Rides.find(querystring).
          exec(function (err, rides) {
            if (!err) {
              reportsummary.available_amount = 0;
              reportsummary.cash_collected = 0;
              reportsummary.booking_count = ridesstatscount;
              rides.forEach(function (ridesstats) {
                let rideids = [ridesstats._id];
                let tax = parseFloat(ridesstats.tax);
                let baseprice = parseFloat(ridesstats.baseprice);
                total_earning += tax + baseprice;
              });
              /* total earnings*/
              reportsummary.total_earning = Math.round(total_earning * 100) / 100;
              Rides.count({ created_at: { $gte: todaystarts, $lte: todayends, }, driver_id: req.params.userid, ridestatus: "completed" }, function (err, ridetoday) {
                if (ridetoday > 0) {
                  ridebytoday = ridetoday;
                }
                reportsummary.ride_today = ridebytoday;
                Rides.count({ created_at: { $gte: monthstarts, $lte: monthends, }, driver_id: req.params.userid, ridestatus: "completed" }, function (err, ridemonth) {
                  if (ridemonth > 0) {
                    ridebymonth = ridemonth;
                  }
                  reportsummary.ridebymonth = ridebymonth;
                  let query = Rides.aggregate([
                  {
                    $match: {
                      driver_id: req.params.userid,
                      ridestatus:"completed"
                    }
                  },
                  {
                    "$project": {
                      "y": {
                        "$year": "$created_at"
                      },
                      "m": {
                        "$month": "$created_at"
                      },
                    }
                  },
                  {
                    "$group": {
                      "_id": {
                        "year": "$y",
                        "month": "$m",
                      },

                      count: {
                        "$sum": 1
                      }
                    }
                  },
                  {
                    $sort: {
                      "_id.year": 1,
                      "_id.month": 1,
                      "_id.day": 1
                    }
                  }]);
                  
                  let paymentQuery=Payments.aggregate([
                  {
                   $match: {
                    driver_id: req.params.userid,
                    payment_type: 'cash'
                  }
                },{
                  $group: {
                    _id: "null",
                    totalbaseprice: { $sum: "$baseprice" },
                    totalcommissionamount: { $sum: "$commissionamount" },
                    totaltax: { $sum: "$tax" }
                  }},
                  {
                    $addFields:{
                      totalamount: { $add: ["$totalbaseprice","$totalcommissionamount","$totaltax"] }
                    }}
                    ]);

                  let availableamoutQuery=Payments.aggregate([
                  {
                   $match: {
                    driver_id: req.params.userid
                  }
                },{
                  $group: {
                    _id: "null",
                    totalbaseprice: { $sum: "$baseprice" },
                    totaltax: { $sum: "$tax" }
                  }},
                  {
                    $addFields:{
                      totalsumamount: { $add: ["$totalbaseprice","$totaltax"] }
                    }}
                    ]);

                  let settlementQuery=Settlements.aggregate([
                  {
                   $match: {
                    driver_id: req.params.userid,
                  }
                },{
                  $group: {
                    _id: "null",
                    totalearnings: { $sum: "$total_earning" },
                  }},
                  ]);

                  query.exec(function (err, ridedetails) {
                    if (err) {
                      senderr(res);
                    }
                    else {
                      let data = JSON.parse(JSON.stringify(ridedetails));
                      let latestridesbymonth = [];
                      for (let i = 0; i < data.length; i++) {
                        let ridemonth = JSON.parse(JSON.stringify(data[i]._id));
                        for (let key in ridemonth) {
                          if (key == 'month' && ridemonth["year"] == thisyear) {
                            latestridesbymonth.push({
                              month: ridemonth["month"],
                              count: data[i].count,
                            });
                          }
                        }
                      }
                      reportsummary.cumulative_report = latestridesbymonth;
                      Driver.findOne({ _id: req.params.userid }, function (err, driver) {
                        if (!err) {
                          reportsummary.livestatus = ((driver.live_status == '0') ? "false" : "true");
                          settlementQuery.exec(function (err, settlementdetails) {
                            //console.log(settlementdetails);
                            if(!err && settlementdetails.length >0){
                              settledamount=settlementdetails[0].totalearnings;
                            }
                            availableamoutQuery.exec(function (err, availableamountdetails) {
                              if(!err && availableamountdetails.length >0){
                                let availamount = parseFloat(availableamountdetails[0].totalsumamount)- parseFloat(settledamount);
                                reportsummary.available_amount = Math.round(availamount * 100) / 100;
                              }
                              paymentQuery.exec(function (err, paymentdetails) {
                                if(!err && paymentdetails.length >0){
                                  reportsummary.cash_collected = Math.round(paymentdetails[0].totalamount * 100) / 100;
                                }
                                Reviews.count({ driver_id: req.params.userid }, function (err, count) {
                                  if (count > 0) {
                                    reportsummary.rating = parseFloat(driver.rating / count).toFixed(1);
                                    res.json(reportsummary);
                                  }
                                  else {
                                    reportsummary.rating = "0";
                                    res.json(reportsummary);
                                  }
                                });});});});
                        }
                        else {
                          senderr(res);
                        }
                      });
                    }
                  });

                });
});
}
else {
  senderr(res);
}
});
}
else {
  Driver.findOne({ _id: req.params.userid }, function (err, driver) {
    if (!err) {
      let noreportedsummary = {
        status: "true", available_amount: 0, cash_collected: 0,
        total_earning: 0, ride_today: 0, ridebymonth: 0, rating: "0", booking_count: 0, livestatus: ((driver.live_status == '0') ? "false" : "true"), cumulative_report: []
      };
      res.json(noreportedsummary);
    }
    else {
      senderr(res);
    }
  });
}
});
}
});

  /* upload user image */
  router.post('/uploadimage', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.profileimage) {
      res.json({ status: "false", message: "Something went to be wrong" });
    } else {
      let base64Data = req.body.profileimage;
      let imagename = Date.now() + '.jpeg';
      fs.writeFile(driverassets + imagename, base64Data, 'base64', function (err) {
        if (err) {
          res.json({ status: "false", message: "Something went to be wrong" });
        }
        else {
          Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
            if (driver && typeof driver.profile_image != 'undefined') {
              fs.unlink(driverassets + driver.profile_image, function (error) {
                if (error) {
                  res.json({ status: "false", message: "Something went to be wrong" });
                }
              });
            }
            driver.profile_image = imagename;
            driver.save();
            res.json({ status: "true", message: 'Image uploaded successfully' });
          });
        }

      });
    }
  });

  /* upload user image */
  let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, driverassets)
    },
    filename: function (req, file, callback) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return callback(err);
        callback(null, raw.toString('hex') + path.extname(file.originalname));
      });
    }
  });

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
    }).single('driverImage');
    upload(req, res, function (err) {
      Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
        if (driver && typeof driver.profile_image != 'undefined') {
          fs.unlink(driverassets + driver.profile_image, function (error) {
            if (error) {
              res.json({ status: "false", message: "Something went to be wrong" });
            }
          });
        }
        driver.profile_image = res.req.file.filename;
        driver.save();
        res.json({ status: "true", user_image: base_url + '/gallery/drivers/' + res.req.file.filename, message: 'Image uploaded successfully' });
      });
    })
  });

  /* upload user documents */
  router.post('/uploaddoc', function (req, res) {

    let result, colname;
    let upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
          return callback(res.end('Only images & pdf are allowed'), null)
        }
        callback(null, true)
      }
    }).single('uploaddoc');
    upload(req, res, function (err) {
      Vehicles.findOne({ user_id: req.body.user_id }, function (err, vehicles) {
        if (req.body.uploaddocfor == "insurancedoc") {
          if (vehicles && typeof vehicles.insurancedoc != 'undefined' && vehicles.insurancedoc != null) {
            colname = vehicles.insurancedoc;
          }
          result = { insurancedoc: res.req.file.filename };
        }
        else if (req.body.uploaddocfor == "licensedoc") {
          if (vehicles && typeof vehicles.licensedoc != 'undefined' && vehicles.licensedoc != null) {
            colname = vehicles.licensedoc;
          }
          result = { licensedoc: res.req.file.filename };
        }
        else {
          if (vehicles && typeof vehicles.bookdoc != 'undefined' && vehicles.bookdoc != null) {
            colname = vehicles.bookdoc;
          }
          result = { bookdoc: res.req.file.filename };
        }
        if (vehicles && typeof colname != 'undefined' && colname != null) {
          fs.unlink(driverassets + colname, function (error) {
            if (error) {
              res.json({ status: "false", message: "Something went to be wrong123" });
            }
          });
        }
        Vehicles.findOneAndUpdate({ "user_id": req.body.user_id }, { $set: result }).exec(function (err, vehicles) {
          if (err) {
            res.json({ status: "false", message: "Something went to be wrong12" });
          } else {
            res.json({ status: "true", message: 'Image uploaded successfully' });
          }
        });
      });
    });
  });


  /* driver online or offline */
  router.post('/liveme', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.status) {
      senderr(res);
    } else {
      Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
        if (!driver) {
          senderr(res);
        } else {
          let liveme = "0";
          if (req.body.status == 'online') {
            liveme = "1";
          }
          driver.live_status = liveme;
          driver.save(function (err) {
            res.json({ status: "true", message: 'Driver is ' + req.body.status });
          });
        }
      });
    }
  });

  /* online driver instant status */
  router.post('/whereiam', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id || !req.body.status) {
      senderr(res);
    } else {
      let query;
      let timestamp = timeZone();
      if (req.body.status == "onride") {
        query = Rides.findOne({ _id: req.body.onride_id, onride_otp: req.body.onride_otp });
      }
      else {
        query = Rides.findOne({ _id: req.body.onride_id });
      }
      query.exec(function (err, rides) {
        if (!rides) {
          res.json({ status: "false", message: "OTP verification failed." });
        } else {
          rides.ridestatus = req.body.status;
          rides.ridestatusat = timestamp;
          rides.save(function (err) {
            Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
              driver.live_status = "2";
              driver.save();
              if (req.body.status == "ontheway") {
                let userids = [rides.user_id];
                let message = "Your driver is arriving now";
                let data = { "ride_id": rides._id, "type": "ontheway", "message": message };
                userNotific(userids, message, data);
              }
              res.json({ status: "true", message: "Status changed successfully" });
            });
          });
        }
      });
    }
  });

  /* driver accept status */
  router.post('/goride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id };
      Rides.findOne(querystring).populate('user_id').
      exec(function (err, rides) {
        if (!rides) {
          senderr(res);
        } else {
          let rideresult = {};
          if (rides.ridestatus == "requested" || rides.ridestatus == "scheduled" || rides.ridestatus == "ridenotaccepted" || rides.ridestatus == "scheduleridenotaccepted") {
            rides.ridestatus = "accepted";
            rides.driver_id = req.body.user_id;
            Vehicles.findOne({ user_id: rides.driver_id }).exec(function (err, vehicles) {
              if (!vehicles) {
                senderr(res);
              }
              else {
                rides.vehicle_no = vehicles.vehicle_number;
                rides.save(function (err) {
                  if (err) {
                    senderr(res);
                  }
                  else {
                    Driver.findOne({ _id: req.body.user_id }, function (err, driver) {
                      if (!err) {
                        driver.live_status = "2";
                        driver.save();
                        rideresult.status = "true";
                        rideresult.user_name = rides.user_id.full_name;
                        rideresult.onride_otp = rides.onride_otp;
                        rideresult.pickup_location = rides.pickup_location;
                        rideresult.pickup_lat = rides.pickup_lat;
                        rideresult.pickup_lng = rides.pickup_lng;
                        rideresult.drop_location = rides.drop_location;
                        rideresult.drop_lat = rides.drop_lat;
                        rideresult.drop_lng = rides.drop_lng;
                        rideresult.vehicle_no = rides.vehicle_no;
                        res.json(rideresult);
                      }
                      else {
                        senderr(res);
                      }

                    });

                  }
                });
              }
            });
          }
          else {
            res.json({ status: "false", message: "This ride is unavailable now. Kindly look for another one." });
          }
        }
      });
    }
  });

  /* ride marked completed by driver */
  router.post('/completeride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id || !req.body.distance) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id };
      let timestamp = timeZone();
      let distance = parseFloat(req.body.distance).toFixed(2);
      Rides.findOne(querystring).populate('user_id').populate('category_id').
      exec({ _id: req.body.onride_id }, function (err, rides) {
        if (!rides) {
          senderr(res);
        } else {
          Admin.findOne(function (err, admin) {
            if (rides.ridestatus == "onride") {
              rides.ridestatus = "completed";
              rides.ridestatusat = timestamp;
              rides.ridedistance = distance;
              let distbycat = [];
              distbycat[rides.category_id._id] = distance;
              let fareamount = totalFare(rides.category_id, distbycat, admin.maxDistance);
              rides.baseprice = fareamount;
              rides.total = fareamount;
  // save the driver details  
  rides.save(function (err) {
    if (err) {
      senderr(res);
    }
    else {
      let result = { live_status: "1" };
      Driver.findOneAndUpdate({ _id: rides.driver_id }, { $set: result }).exec(function (err, driver) {
        if (err) {
          senderr(res);
        } else {
        /* let notifications = {
          user_id: req.body.user_id, notify_to: rides.user_id._id, title: "Ride Completed",
          message: "Your Ride has been completed."
        };
        notifyTo(notifications); */
        Commissions.find().exec(function (err, results) {
          let taxamount = 0, commissionamount = 0, tax;
          let resultcount = results.length;
          tax = admin.tax;
          taxamount = parseFloat(rides.baseprice) * (tax / 100);
          if (resultcount > 0) {
            results.forEach(function (d) {
              let dprice_from = parseFloat(d.price_from);
              let dprice_to = parseFloat(d.price_to);
              if (rides.baseprice >= dprice_from && rides.baseprice <= dprice_to) {
                commissionamount = parseFloat(rides.baseprice) * (d.percentage / 100);
              }
            });
          }
          let basepricewithcommission = parseFloat(rides.baseprice) + parseFloat(commissionamount);
          rides.baseprice = basepricewithcommission.toFixed(2);
          rides.commissionamount = commissionamount.toFixed(2);
          rides.tax = taxamount.toFixed(2);
          rides.save();
          res.json({ status: "true", type: rides.payment_type, message: 'Your Ride has been marked as completed' });

        });

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
              rideresult.user_image = base_url + '/gallery/users/' + rides.user_id.profile_image;
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


  /* user review a ride */
  router.post('/ridedetails', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id || !req.body.type) {
      senderr(res);
    } else {
      let querystring = { _id: req.body.onride_id, ridestatus: req.body.type };
      let rideresult = {};
      Rides.count(querystring, function (err, count) {
        if (count > 0) {
          Rides.findOne(querystring).populate('category_id').populate('user_id').
          exec(function (err, rides) {
            if (!err) {
              rideresult.status = "true";
              rideresult.user_name = rides.user_id.full_name;
              rideresult.category_name = rides.category_id.category_name;
              let profile_image = rides.category_id.image;
              if (typeof profile_image == 'undefined') {
                let profile_image = 'category.png';
              }
              let categoryimage = base_url + '/imagegallery/' + profile_image;
              rideresult.category_image = categoryimage;
              rideresult.pickup_location = rides.pickup_location;
              rideresult.pickup_lat = rides.pickup_lat;
              rideresult.pickup_lng = rides.pickup_lng;
              rideresult.drop_location = rides.drop_location;
              rideresult.drop_lat = rides.drop_lat;
              rideresult.drop_lng = rides.drop_lng;
              rideresult.onride_otp = rides.onride_otp;
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
      let querystring = [{ ridestatus: 'onride' }, { ridestatus: 'ontheway' }, { ridestatus: 'scheduled' }, { ridestatus: 'accepted' }];
      let rideresult = [], taxprice, statustime, vehicle_no;
      if (req.body.type == "passed") {
        querystring = [{ ridestatus: 'cancelled' }, { ridestatus: 'completed' }];
      }
      Rides.find({ driver_id: req.body.user_id }).or(querystring).populate('category_id').sort({ '_id': -1 }).
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
                taxprice = Math.round(c.tax * 100) / 100;
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


  /* cancel a ride */
  router.post('/cancelride', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.onride_id) {
      senderr(res);
    } else {
      Rides.findOneAndUpdate({ _id: req.body.onride_id }, {
        "$set": {
          ridestatus: "cancelled"
        }
      }).exec(function (err, reviews) {
        if (err) {
          senderr(res);
        } else {
  /*let notifications = {
  user_id: req.body.user_id, notify_to: rides.user_id, title: "Ride Canceelled",
  message: "Your Ride has been cancelled by the driver"
  };
  notifyTo(notifications);*/
  res.json({ status: "true", message: 'Your Ride has been cancelled' });
}
});
    }
  });


  /* pay by cash or wallet */
  router.post('/paybycash', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (!req.body.user_id || !req.body.amount || !req.body.onride_id || !req.body.iswallet || !req.body.basefare || !req.body.commissionamount || !req.body.tax || !req.body.rideuserid) {
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
            user_id: req.body.rideuserid, onride_id: req.body.onride_id, payment_type: paidby,
            ride_fare: req.body.amount,baseprice: req.body.basefare, commissionamount: req.body.commissionamount, tax: req.body.tax,
            driver_id: req.body.user_id
          };
          let newPayment = new Payments(payObject);
          newPayment.save(function (err) {
            if (!err) {
              if (req.body.iswallet == "1") {
                let paywalletObject = {
                  user_id: req.body.rideuserid, onride_id: req.body.onride_id,
                  amount: req.body.walletamount, type: "debit", transaction: "payride", updated_at: timeZone()
                };
                let newWallet = new Wallet(paywalletObject);
                newWallet.save(function (err) {
                  if (!err) {
                    User.findOneAndUpdate({ "_id": req.body.rideuserid },
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
                            user_id: "0", notify_to: req.body.rideuserid, title: "Payment Completed",
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
                              let userids = [req.body.rideuserid];
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
                  user_id: "0", notify_to: req.body.rideuserid, title: "Payment Completed",
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
                    let userids = [req.body.rideuserid];
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


  /* Pushnotify */
  userNotific = function (driverIds, message, data) {
    NotifyDevices.find({ device_type: "0" })
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
    NotifyDevices.find({ device_type: "1" })
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

  module.exports = router;