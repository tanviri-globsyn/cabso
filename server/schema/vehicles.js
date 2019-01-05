var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var VehicleSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique:true,
        ref:'Driver'
    },
    vehicle_name: {
        type: String,
    },
    available_seats: {
        type: Number,
    },
    body_type: {
        type: String,
    },
    amenitites: {
        type: Object,
    },
    vehicle_number: {
        type: String,
    },
    licence_no: {
        type: String,
    },
    licensedoc: {
        type: String,
    },
    licence_date: { type: String },
    insurance_no: {
        type: String,
    },
    insurancedoc: {
        type: String,
    },
    insurance_date: { type: String },
    book_no: {
        type: String,
    },
    bookdoc: {
        type: String,
    },
    book_date: { type: String },
    amenities:{ type: Object},
    status:{type:String},
    category: {
        type: String,
        ref: 'Categories'
    },
    completionStatus:{
        type: String,
    },
    
});

module.exports = mongoose.model('Vehicles', VehicleSchema);