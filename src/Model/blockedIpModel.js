
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
    type: Date,
    default: Date.now,
    index: { expires: '3540' },
  },
});

const blockedIp = mongoose.model('Blocked IP', addressSchema);

module.exports = blockedIp;
