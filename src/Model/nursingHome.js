const mongoose = require("mongoose");
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
  category: {
    type: String,
  },
  mainCategory: {
    type: String,
    default: "nursingHome",
  },
  contactedCustomer: {
    type: Number,
    default: 0,
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
  //mohsin scraping
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  overall_rating: {
    type: String,
  },
  patient_survey_rating: {
    type: String,
  },
  number_of_certified_beds: {
    type: String,
  },
  overall_rating: {
    type: String,
  },
  management: {
    type: String,
  },
  in_hospital: {
    type:Boolean
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

const nursinghomes = mongoose.model("nursing homes", addressSchema);

module.exports = nursinghomes;
