var express = require('express');
var app = express();
var router = express.Router();
var Rides = require('../schema/rides');
var moment = require('moment');
var tomorrow;

router.route('/').get(function (req, res) {
    Rides.find().sort({$natural:-1}).populate("category_id").populate("user_id").populate("driver_id")
    .exec(function (err, rides) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
          res.json(rides);
   
       }
  
    }); 
  });

  router.route('/getDriverRide/:id').get(function (req, res) {
    Rides.find({driver_id:req.params.id}).sort({$natural:-1})
    .exec(function (err, rides) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
          res.json(rides);
   
       }
  
    }); 
  });


  router.route('/getDriverRideCount/:id').get(function (req, res) {
    Rides.count({driver_id:req.params.id}).sort({$natural:-1})
    .exec(function (err, rides) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
          res.json(rides);
   
       }
  
    }); 
  });


  router.route('/info/:id').get(function (req, res) {
    Rides.findById(req.params.id).populate("category_id").populate("user_id").populate("driver_id")
    .exec(function (err, rides) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
         res.json(rides);
       }
  
    }); 
  });


  router.route('/Driverinfo/:id').get(function (req, res) {
    Rides.findById({user_id:req.params.id})
    .exec(function (err, rides) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
         res.json(rides);
       }
  
    }); 
  });


  router.route('/totalCount').get(function (req, res) {
    Rides.count(function(err, count) {
      if (err)
      return res.json({error: true, msg: "Ride not exists"});   
      res.json(count); 
    });
    });

    router.route('/currentRecords').get(function (req, res) {
      date = new Date();
         Rides.count({'$where': 'this.created_at.toJSON().slice(0, 10) == "'+date.toJSON().slice(0, 10)+'"' },function(err, rides) {
        if (err)
        return res.json({error: true, msg: err});   
        res.json(rides); 
      });
      });


      router.route('/currentMonth').get(function (req, res) {
        date = new Date();
       // console.log(date.getMonth()-1)
          Rides.count({'$where': 'this.created_at.getMonth() == "'+date.getMonth()+'"' },function(err, rides) {
          if (err)
          return res.json({error: true, msg: err});   
          res.json(rides); 
        });
        });




      router.route('/lastMonth').get(function (req, res) {
        date = new Date();
       // console.log(date.getMonth())
          Rides.find({'$where': 'this.created_at.getMonth() == "'+date.getMonth()+'"' },function(err, rides) {
          if (err)
          return res.json({error: true, msg: err});   
          res.json(rides); 
        });
        });
  

        router.route('/latestRide').get(function (req, res) {
          Rides.find().sort({$natural:-1}).limit(10).populate("category_id").populate("user_id").populate("driver_id")
          .exec(function (err, ride) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
               res.json(ride);
             }
        
          }); 
        });
  
        router.route('/cancel').get(function (req, res) {
          Rides.count({ridestatus:"cancelled"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });

        router.route('/completed').get(function (req, res) {
          Rides.count({ridestatus:"completed"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });


        router.route('/onride').get(function (req, res) {
          Rides.count({ridestatus:"onride"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });

        router.route('/ontheway').get(function (req, res) {
          Rides.count({ridestatus:"ontheway"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });

        router.route('/scheduled').get(function (req, res) {
          Rides.count({ridestatus:"scheduled"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });

        router.route('/accepted').get(function (req, res) {
          Rides.count({ridestatus:"accepted"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });
        router.route('/ridenotaccepted').get(function (req, res) {
          Rides.count({ridestatus:"ridenotaccepted"})
          .exec(function (err, rides) {
            if(err){
              return res.json({error: true, msg: "Unable to load records from database"});
             }
             else {
                res.json(rides);
           }
        
          }); 
        });


   //   db.posts.find({"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
  module.exports = router;

//  date.getFullYear()+'-' + (date.getMonth()) + '-'+date.getDate();
 // date = new Date();
 // console.log(new Date().toISOString());
//   console.log(today.toDate());
//  console.log(tomorrow.toDate());
  //var today = moment().startOf('day');
 // console.log(moment().startOf('day'));
//   date.getFullYear()+'-' + (date.getMonth()) + '-'+date.getDate();
//   console.log(date.getFullYear()+'-' + (date.getMonth()) + '-'+date.getDate());
// //  date = new Date('2013-03-10T02:00:00Z');date.getFullYear()+'-' + (date.getMonth()) + '-'+date.getDate();
