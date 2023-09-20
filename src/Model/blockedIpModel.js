const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  ip: {
    type: String,
  },
  blockedStatus: {
    type: Boolean,
  },
  expireAt: {
    type: Date, // This field will store the expiration date/time
    default: Date.now, // Set the default value to the current date/time
    index: { expires: '1h' }, // Set the TTL index for automatic removal
  },
});

const blockedIp = mongoose.model('Blocked IP', addressSchema);

module.exports = blockedIp;
