const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  //new added field
  cms_certification_number: {
    type: String,
  },
  provider_ssa_county_code: {
    type: Number,
  },
  county_or_parish: {
    type: String,
  },
  ownership_type: {
    type: String,
  },
  average_number_of_residents_per_day: {
    type: Number,
  },
  average_number_of_residents_per_day_footnote: {
    type: String,
  },
  provider_type: {
    type: String,
  },
  provider_resides_in_hospital: {
    type: Boolean,
  },
  legal_business_name: {
    type: String,
  },
  date_first_approved_to_provide_medicare_and_medicaid_services: {
    type: String,
  },
  affiliated_entity_name: {
    type: String,
  },
  affiliated_entity_id: {
    type: Number,
  },
  //new added field end
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
    default: 'nursingHome',
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
    index: true,
  },
  longitude: {
    type: String,
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Only 'Point' is allowed
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  patient_survey_rating: {
    type: String,
  },
  number_of_certified_beds: {
    type: String,
  },
  overall_rating: {
    type: Number,
  },
  management: {
    type: String,
  },
  in_hospital: {
    type: Boolean,
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

// const hospitals = mongoose.model('hospitalnew', addressSchema, 'hospitalnew');
addressSchema.index({ location: '2dsphere' });

const nursinghomes = mongoose.model(
  'nursingHomenew',
  addressSchema,
  'nursingHomenew'
);

module.exports = nursinghomes;
