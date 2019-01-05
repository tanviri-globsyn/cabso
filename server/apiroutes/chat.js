let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 8083;

/** schemas */
let User = require("../schema/user");
let Driver = require("../schema/driver");
let Rides = require("../schema/rides");
let Admin = require("../models/admin");

/* check nodejs working*/
server.listen(port, function () {
  //console.log('Server listening at port %d', port);
});

/* socket connection */
io.sockets.on('connection', function (socket) {

  //console.log("user Connected");
  /* share driver instant location */
  /* share driver instant location */
  socket.on('sharelocation', function (data) {
    var result = { loc: [data.lng, data.lat], instant_lat: data.lat, instant_lng: data.lng,instant_location:data.location };
    Driver.findOneAndUpdate({ _id: data.user_id }, { "$set": result }).exec(function (err, users) {
     // console.log("sharing location" + data.location);
    });
  });

  /* rides details */
  socket.on('whereareyou', function (data) {
    let querystring = { _id: data.onride_id };
    Rides.findOne(querystring).populate('driver_id').
      exec(function (err, rides) {
        if (!rides) {
          //senderr(res);
        } else {
          let ridesresult = {};
          ridesresult.instant_lan = rides.driver_id.instant_lat;
          ridesresult.instant_lng = rides.driver_id.instant_lng;
          ridesresult.ridestatus = rides.ridestatus;
          socket.emit('iamhere', ridesresult);
        }
      });
  });

  /* grab nearby */
  socket.on('cabneargo', function (data) {
    let lng = parseFloat(data.lng);
    let lat = parseFloat(data.lat);
    let categoryid = data.category_id;
    Admin.findOne(function (err, admin) {
      /* maximum distance coverage */
      let maxdistcoverage = parseInt(admin.distancePerCab);
      let query = Driver.aggregate([
        {
          "$geoNear": {
            "near": { "type": "Point", "coordinates": [lng, lat] },
            "maxDistance": maxdistcoverage * 1000,
            "spherical": true,
            "distanceField": "distance",
            "query": { "live_status": "1", "approval": "1", "category_id": categoryid },
          }
        },
        { "$sort": { "distance": 1 } },
      ]);
      query.exec(function (err, driver) {
        if (err) {
          //senderr(res);
          //console.log("Error" + err);
        }
        else {
          if (driver.length == '0') {
            //senderr(res);
            //console.log("No drivere in the socket");
          } else {
            let nearbycategories = [];
            driver.forEach(function (c) {
              nearbycategories.push({
                id: c._id,
                category_name: c.category_name,
                image: c.image,
                lat: c.instant_lat,
                lng: c.instant_lng,
              });
            });
            socket.emit('cabnearby', nearbycategories);
          }
        }
      });
    });
  });
});

module.exports = router;