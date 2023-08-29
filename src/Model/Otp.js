const mongoose = require('mongoose');


const Schema = mongoose.Schema

const otpSchema = new Schema({
    email: String,
    code: String,
    expiresIn: {
        type: Date,
        expires: '2m',
        default: Date.now
      }
});



module.exports = mongoose.model('Otp', otpSchema);