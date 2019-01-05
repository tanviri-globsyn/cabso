var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');
var path = require('path');
// Require Item model in our routes module
var Category = require('../schema/categories');
var fs = require('fs');
var Bodytypes = require('../schema/bodytypes');
var Amenities = require('../schema/amenities');



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
    Category.find(function (err, category){
     if(err){
      return res.json({error: true, msg: err});
     }
     else {
       res.json(category);
     }
   });
 });

 router.route('/bodytype').get(function (req, res) {
  Bodytypes.find(function (err, type){
   if(err){
    return res.json({error: true, msg: err});
   }
   else {
       res.json(type);
   }
 });
});

router.route('/amenities').get(function (req, res) {
  Amenities.find(function (err, type){
   if(err){
    return res.json({error: true, msg: err});
   }
   else {
     res.json(type);
   }
 });
});

router.route('/add').post(function (req, res) {
  var category = new Category(req.body);
  category.save()
    .then(item => {
      return res.json({success: true, msg: 'category added successfully'});      
    })
    .catch(err => {
      console.log(err);
      return res.json({error: true, msg:err});
    });
});



// router.post('/add', upload.single('image'), function (req, res, next) {
//   var category = new Category(req.body);
//   console.log(req.body);
//   category.category_name=category.category_name;
//   category.image=req.file.filename;
//    category.bodytypes=category.bodytypes;
//    category.amenities=category.amenities;
//   category.unitprice=category.unitprice;
//   category.baseprice=category.baseprice;
//   category.reach_pickup=category.reach_pickup;
//   category.save()
//     .then(item => {
//       return res.json({success: true, msg: 'Category added successfully'});     
//     })
//     .catch(err => {
//       return res.json({error: true, msg: 'Category Type Exists'});     
//     });
// });

// router.post('/add', upload.single('image'), function (req, res, next) {
//   var banner = new Banner(req.body);
//   banner.title=banner.title;
//   banner.image=req.file.filename;
//   banner.status=1;
//   banner.type=banner.type;
//   banner.save()
//     .then(item => {
//       return res.json({success: true, msg: 'Banner added successfully'});     
//     })
//     .catch(err => {
//       return res.json({error: true, msg: 'Banner Type Exists'});     
//     });
// });


router.post('/updateImage/:id', upload.single('image'), function (req, res, next) {
  Category.findById(req.params.id, function (err, category)
  {
    if (!category)
    return next(new Error('Could not load Document'));
  else {
    category.image=req.file.filename;
    category.save().then(category => {
      return res.json({success: true, msg: 'Category image updated successfully'});      
    })
    .catch(err => {
      return res.json({error: true, msg: "Category image not updated"});   
         
    });
  }
});
});


router.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Category.findById(id, function (err, category){
      res.json(category);
  });
});



router.route('/update/:id').post(function (req, res) {
  Category.findById(req.params.id, function(err, category) {
   if (!category)
     return next(new Error('Could not load Document'));
   else {
    category.category_name = req.body.category_name;
    category.bodytypes = req.body.bodytypes;
    category.amenities = req.body.amenities;
    category.unitprice=req.body.unitprice;
    category.baseprice=req.body.baseprice;
    category.save().then(category => {
       return res.json({success: true, msg: 'Category updated successfully'});      
     })
     .catch(err => {
       return res.json({error: true, msg: err});   
          
     });
   }
 });
});


router.route('/delete/:id').get(function (req, res) {
  Category.findByIdAndRemove({_id: req.params.id}, function(err, banner){
       if(err) res.json({error: true, msg: "Category not deleted"}); 
       else 
       return res.json({success: true, msg: 'Category Deleted Successfully'});      

   });
});

 module.exports = router;