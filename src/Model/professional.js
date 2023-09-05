const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: String,
  zip_code: String,
  city: String,
  contact: String,
  latitude: Number,
  longitude: Number
});

const professionalSchema = new mongoose.Schema({
  name: String,
  sex: String,
  state: String,
  locations: [locationSchema],
  education_and_training: String,
  board_certifications: [String],
  specialities: [String],
  group_affiliations: [String],
  affiliations: {
    Hospital: [String]
  },
  provides_telehealth_services: Boolean
});

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;
