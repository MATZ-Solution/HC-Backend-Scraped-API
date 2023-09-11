const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
  },
  profile: {
    type: String,
  },
  description: {
    type: String,
  },
  mainCategory: {
    type: String,
  },
  category: {
    type: String,
  },
  city: {
    type: String,
    index: true
  },
  phoneNumber: {
    type: String,
  },
  fullAddress: {
    type: String
  },
  zipCode: {
    type: String,
    index: true
  },
  state: {
    type: String,
    index: true
  },
  closed: {
    type: String,
  },
  //mohsin scraping
  latitude: {
    type: String,
    index:true
  },
  longitude: {
    type: String,
    index:true

  },
  overall_rating: {
    type: String,
  },
  patient_survey_rating: {
    type: String,
  },
  number_of_beds: {
    type: String
  },
  openingHours: {
    Mon: { type: String },
    Tue: { type: String },
    Wed: { type: String },
    Thu: { type: String },
    Fri: { type: String },
    Sat: { type: String },
    Sun: { type: String }
  },
  reviews: [
    {
      name: { type: String },
      email: { type: String },
      reviews: { type: String },
      startRating: { type: Number },
      date: { type: Date, default: Date.now }

    }
  ],
  complain: [
    {
      name: { type: String },
      email: { type: String },
      complain: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

const Address = mongoose.model('scrapeddatas', addressSchema);

module.exports = Address;
