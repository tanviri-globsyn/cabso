var express = require('express');
var app = express();
var router = express.Router();
var Payment = require('../schema/payments');
var Driver = require('../schema/driver');



router.route('/').get(function (req, res) {
    Payment.find().sort({$natural:-1}).populate("user_id").populate("onride_id")
    .exec(function (err, payment) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
         res.json(payment);
       }
  
    }); 
  });

  router.route('/info/:id').get(function (req, res) {
    Payment.findById(req.params.id).populate("user_id").populate("onride_id")
    .exec(function (err, payment) {
      if(err){
        return res.json({error: true, msg: "Unable to load records from database"});
       }
       else {
         res.json(payment);
       }
  
    }); 
  });

  
/*router.route('/totalAmt').get(function (req, res) {
  Payment.aggregate([
  
     {
      "$group": {
        "_id": "$driver_id",
        total_fare: { $sum: "$ride_fare" },
        commission: { $sum: "$commissionamount" },
        tax: { $sum: "$tax" },
        earning: { $sum:{ $add: [ "$ride_fare", "$tax" ] }},
        "driverID": { "$first": "$driver_id" },
        count: { $sum: 1},
        "paid": { "$first": "$paid" },
      }
    },

    {
      $match: {
        paid: {
              $eq: 0
          }
      }


    }
  

  ]) .exec(function (err, payment) {
 
    Driver.populate( payment, { "path": "driverID" }, function(err,results) {
      if(err){
          return res.json({error: true, msg: "Unable to load records from database"});
         }
         else {
           res.json(results);
         }
  });
  }); 
});*/


router.route('/totalAmt').get(function (req, res) {
  let admincommission=0,driverearnamount;
  let drivertotalearnings=[];
  let driverwalletearn=[];
  let rideresult = [];
  let paymentQuery=Payment.aggregate([
    { $match: { 
      $and: [ 
      { paid: 0 },  
      {
        $or:[{payment_type : 'wallet'},
        {payment_type : 'card'}
        ] 
      }]
    }
  },
  {
    $group: {
      _id: "$driver_id",
      totalbaseprice: { $sum: "$baseprice" },
      totalcommissionamount: { $sum: "$commissionamount" },
      totaltax: { $sum: "$tax" },
      driverID: { $first: "$driver_id" },
      count: { $sum: 1},
    }},
    {
      $addFields:{
        totalearnings: { $add: ["$totalbaseprice","$totaltax"] }
      }}
      ]);

  paymentQuery.exec(function (err, driver) {
    if (err) {
      return res.json({error: true, msg: "Unable to load records from database"});
    } else {
      Driver.populate( driver, { "path": "driverID" }, function(err,results) {
        if(err){
          return res.json({error: true, msg: "Unable to load records from database"});
        }
        else {
          let cashPayment=Payment.aggregate([
          {
            $match: {
              payment_type: 'cash',
              paid:0
            }
          },{
            $group: {
              _id: "$driver_id",
              adminamount: { $sum: "$commissionamount" },
              totalpaidbywallet: { $sum: "$paidbywallet" },
            }}
            ]);
          cashPayment.exec(function (err, cashpayments) {
            let data = JSON.parse(JSON.stringify(cashpayments));
            for (let s = 0; s < data.length; s++) {
              drivertotalearnings[data[s]._id]= data[s].adminamount;
              driverwalletearn[data[s]._id]=data[s].totalpaidbywallet;
            }
            results.forEach(function (d) {
              if(drivertotalearnings[d._id]=="" || typeof drivertotalearnings[d._id]=="undefined"){
                drivertotalearnings[d._id]=0;
              }

              if(driverwalletearn[d._id]=="" || typeof driverwalletearn[d._id]=="undefined"){
                driverwalletearn[d._id]=0;
              }
              driverearnamount= (parseFloat(d.totalearnings)- parseFloat(drivertotalearnings[d._id])) + parseFloat(driverwalletearn[d._id]);
              rideresult.push({
                id: d._id,
                totalbaseprice:d.totalbaseprice.toFixed(2),
                totalcommissionamount:d.totalcommissionamount.toFixed(2),
                totaltax:d.totaltax.toFixed(2),
                driverID:d.driverID,
                count:d.count,
                totalearnings:driverearnamount.toFixed(2),
              });
            });
            res.json(rideresult);
          });

        }
      });

    }
  });
});

router.route('/getRides/:id').get(function (req, res) {
  Payment.find({settlement_id:req.params.id}).populate("onride_id")
  .exec(function (err, result) {
    if(err){
      return res.json({error: true, msg: "Unable to load records from database"});
     }
     else {
       res.json(result);
     }

  }); 
});


  module.exports = router;