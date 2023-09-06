const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
  },
  fullAddress: {
    type: String,
  },
  contactedCustomer: {
    type: Number,
    default: 0,
  },
  mainCategory: {
    type: String,
    default: "dialysisFacilityData",
  },
  zipCode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  quality_rating: {
    type: String,
  },
  patient_survey_rating: {
    type: String,
  },
  hemodialysis_stations_count: {
    type: Number,
  },
  service_in_center_hemodialysis: {
    type: Boolean,
  },
  service_peritoneal_dialysis: {
    type: Boolean,
  },
  service_home_hemodialysis_training: {
    type: Boolean,
  },
  service_shifts_starting_after_5_pm: {
    type: Boolean,
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

const dialysisFacilityData = mongoose.model("dialysisFacility", addressSchema);

module.exports = dialysisFacilityData;
