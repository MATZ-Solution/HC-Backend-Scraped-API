const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerSchemaMichigan = new Schema({
  name: {
    type: String,
  },
  profile: {
    type: String,
  },
 
  category: {
    type: String,
  },
  mainCategory: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  fullAddress: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  state: {
    type: String,
  },
  bio: {
    type: String,
  },
  specialty: {
    type: String,
  },
  
//   latitude: {
//     type: String,
//   },
//   longitude: {
//     type: String,
//   },
//   location: {
//     type: {
//       type: String,
//       enum: ['Point'], // Only 'Point' is allowed
//       required: true,
//     },
//     coordinates: {
//       type: [Number], // [longitude, latitude]
//       required: true,
//     },
//   },
 overall_rating: {
    type: Number,
  },
});
providerSchemaMichigan.index({ location: '2dsphere' });
const providerDataMichigan = mongoose.model('michigan', providerSchemaMichigan, 'michigan');

module.exports = providerDataMichigan;
