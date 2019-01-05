var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');
var path = require('path');
// Require Item model in our routes module
var Amenities = require('../schema/amenities');
var fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/assets/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage });

router.route('/').get(function (req, res) {
    Amenities.find(function (err, type){
     if(err){
      return res.json({error: true, msg: err});
     }
     else {
       res.json(type);
     }
   });
 });



 router.route('/add').post(function (req, res, next) {
  var amenities = new Amenities(req.body);
  amenities.name=amenities.name;
 // amenities.image=req.file.filename;
  amenities.save()
    .then(item => {
      return res.json({success: true, msg: 'Amenities added successfully'});     
    })
    .catch(err => {
      return res.json({error: true, msg: 'Amenities Type Exists'});     
    });
});


router.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Amenities.findById(id, function (err, amenities){
      res.json(amenities);
  });
});



router.route('/update/:id').post(function (req, res) {
  Amenities.findById(req.params.id, function(err, amenities) {
   if (!amenities)
     return next(new Error('Could not load Document'));
   else {
    amenities.name = req.body.name;
    amenities.save().then(amenities => {
      return res.json({success: true, msg: 'Amenities updated successfully'});      
     })
     .catch(err => {
      return res.json({error: true, msg: 'Amenities not updated'});  
     });
   }
 });
});




 router.post('/updateImage/:id', upload.single('image'), function (req, res, next) {
  Amenities.findById(req.params.id, function(err, amenities) {

     if (!amenities)
     return res.json({error: true, msg: 'Could not load document'});  
    else {
        var image = amenities.image;
      fs.unlink('./src/assets/uploads/'+image, (err) => {
        if (err) throw err;
       });

       amenities.name = req.body.name;
       amenities.image= req.file.filename;
       amenities.save().then(amenities => {
        return res.json({success: true, msg: 'Amenities Updated Successfully'});  
      })
      .catch(err => {
        return res.json({error: true, msg: 'Amenities not updated'});  
      });
    }
  });
 });



router.route('/delete/:id').get(function (req, res) {
  Amenities.findByIdAndRemove({_id: req.params.id}, function(err, amenities){
       if(err) res.json({error: true, msg: "Amenities not deleted"}); 
       else 
       return res.json({success: true, msg: 'Removed Successfully'});      

   });
});

module.exports = router;