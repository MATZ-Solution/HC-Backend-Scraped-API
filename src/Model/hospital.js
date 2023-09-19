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
  emergency_services: {
    type: Boolean,
  },
  meets_criteria_for_promoting_interoperability_of_ehrs: {
    type: String,
  },
  hospital_ownership: {
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
  closed: {
    type: String,
  },
  contactedCustomer: {
    type: Number,
    default: 0,
  },
  //mohsin scraping
  latitude: {
    type: String,
    index: true,
  },
  longitude: {
    type: String,
    index: true,
  },
  overall_rating: {
    type: Number,
  },
  patient_survey_rating: {
    type: String,
  },
  number_of_beds: {
    type: String,
  },
  county_or_parish: {
    type: String,
  },
  openingHours: {
    Mon: { type: String },
    Tue: { type: String },
    Wed: { type: String },
    Thu: { type: String },
    Fri: { type: String },
    Sat: { type: String },
    Sun: { type: String },
  },
  reviews: [
    {
      name: { type: String },
      email: { type: String },
      reviews: { type: String },
      startRating: { type: Number },
      date: { type: Date, default: Date.now },
    },
  ],
  complain: [
    {
      name: { type: String },
      email: { type: String },
      complain: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

// const hospitals = mongoose.model('hospitalnew', addressSchema);
const hospitals = mongoose.model('hospitalnew', addressSchema, 'hospitalnew');

module.exports = hospitals;
