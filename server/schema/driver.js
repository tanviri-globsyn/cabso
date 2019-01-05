var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var DriverSchema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    country_code: {
        type: String,
    },
    phone_number: {
        type: Number,
    },
    lon: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    book: { type: String},
    license: { type: String},
    insurance: { type: String},
    profile_image: String,
    emergency_contact: Object,
    payment_account: Object,
    rating: {
        type: Number,default:0
    },
    vehicle_inspection: { type: String},
    security_deposit: { type: String},
    vehicle_details: { type: String},
    payment_details: { type: String},
    instant_lat:{type:String},
    instant_lng:{type:String},
    last_lat:{type:String},
    last_lng:{type:String},
    instant_location:{type:String},
    category_id:{type:String,ref: 'Categories'},
    live_status:{ type: String,default:0},
    approval:{type : String,default:0},
    loc: {
        type: [ Number ],
        index: {
            type: '2dsphere',
            sparse: true
        }
    },
    batch_id:{
        type:String
    },
     vehicle_id: {
        type: String,
        //required: true,
        //unique:true,
      //  ref:'Vehicles'
    },
    inspectionon: {
    type: Date,
  },
});

DriverSchema.pre('save', function (next) {
    var driver = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(driver.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                driver.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

DriverSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Driver', DriverSchema);