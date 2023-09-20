const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  ip: {
    type: String,
  },
  blockedStatus: {
    type: Boolean,
  },
});

const blockedIp = mongoose.model('Blocked IP', addressSchema);

module.exports = blockedIp;
