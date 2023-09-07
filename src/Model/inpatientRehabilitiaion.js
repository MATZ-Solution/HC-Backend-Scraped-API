const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
  },
  fullAddress: {
    type: String,
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
  contactedCustomer: {
    type: Number,
    default: 0,
  },
  mainCategory: {
    type: String,
    default: 'inpatientRehabilitiation',
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
  treatment_non_traumatic_brain_condition: {
    type: Number,
  },
  treatment_traumatic_brain_condition: {
    type: Number,
  },
  treatment_hip_or_femur_fracture: {
    type: Number,
  },
  treatment_hip_knee_amputation_bone_join_condition: {
    type: Number,
  },
  treatment_nervous_system_disorder: {
    type: Number,
  },
  treatment_traumatic_spinal_cord_disease: {
    type: Number,
  },
  treatment_non_traumatic_spinal_cord_disease: {
    type: Number,
  },
  treatment_stroke: {
    type: Number,
  },
  treatment_miscellaneous_conditions: {
    type: Number,
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

const inpatientRehabilitiationData = mongoose.model(
  'inpatientRehabilitiation',
  addressSchema
);

module.exports = inpatientRehabilitiationData;
