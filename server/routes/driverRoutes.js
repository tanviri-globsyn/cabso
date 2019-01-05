var express = require('express');
var app = express();
var router = express.Router();
var Driver = require('../schema/driver');
var nodemailer = require('nodemailer');
var User = require('../models/admin');


router.route('/').get(function (req, res) {
  Driver.find().sort({$natural:-1}).populate("category_id")
  .exec(function (err, driver) {
    if(err){
      return res.json({error: true, msg: "Unable to load records from database"});
     }
     else {
       res.json(driver);
     }

  }); 
});

 router.route('/deactive/:id').post(function (req, res) {
  Driver.findById(req.params.id, function(err, driver) {
   if (!driver)
     return next(new Error('Could not load Document'));
   else {
    driver.approval = '0';
    driver.save().then(driver => {
       return res.json({success: true, msg: 'Driver Deactivated Successfully'});      
     })
     .catch(err => {
       return res.json({error: true, msg: "Error with Deactivation"});   
          
     });
   }
 });
});

router.route('/active/:id').post(function (req, res) {
  Driver.findById(req.params.id, function(err, driver) {
   if (!driver)
     return next(new Error('Could not load Document'));
   else {
    driver.approval = "1";
    driver.save().then(driver => {
     // return res.json({success: true, msg: 'Driver Activated Successfully'});  
     //start send mail
     User.findOne({}).sort({_id: -1}).exec(function(err, user) {  
      if(!user)
      return next(new Error('Could not load Document'));
      else {
      let mailOptions = {
        to: driver.email, // list of receivers
        subject: "Vehicle approved message", // Subject line
        html:  "Your registered vehicle approved sucessfully" + "<br><br> Regards, <br><br>"+ user.siteName // html body
      };
  
      let transporter = nodemailer.createTransport({
        host: user.smptHost,
        port: user.smtpPort,
        secure: false, 
        auth: {
          user: user.smtpUsername, 
          pass: user.smtpPassword 
        }
      });
  
  
      //send mail with defined transport object
      transporter.verify(function(error, success) {
        if (error) {
          if(error) res.json({error: true, msg: "Sorry, SMTP Connection error check email setting"}); 
        } else {

          transporter.sendMail(mailOptions, (err, result) => {
            if(err) res.json({error: true, msg: "Message not send"}); 
            else 
            return res.json({success: true, msg: 'Vehicle activation message send to driver'});   
          });   
        }
     });
  
    
    } 
    })
     //end mail
     })
     .catch(err => {
       return res.json({error: true, msg: "Error with Deactivation"});   
          
     });
   }
 });
});
 
router.route('/info/:id').get(function (req, res) {
  Driver.findById(req.params.id).populate("category_id")
  .exec(function (err, driver) {
    res.json(driver);
  }); 
});

router.route('/driverCount').get(function (req, res) {
  Driver.count(function(err, count) {
    if (err)
    return res.json({error: true, msg: "Driver not exists"});   
    res.json(count); 
  });
  });

  router.route('/onlineDriver').get(function (req, res) {
    Driver.count({$and:[{approval: 1}, {live_status:1}]})
    .exec(function (err, count) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
          res.json(count);
     }
  
    }); 
  });


  router.route('/activeDriver').get(function (req, res) {
    Driver.count({$and:[{approval: 1}, {live_status:0}]})
    .exec(function (err, count) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
          res.json(count);
     }
  
    }); 
  });


 module.exports = router;