const mongoose = require('mongoose');

const adultDayCareSchema = new mongoose.Schema({
  mainCategory: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  offerings: {
    type: [String],
    required: true,
  },
  caringStars: {
    isTopRated: {
      type: Boolean,
      default: false,
    },
    qualifiedInYear: String,
    category: String,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  fullAddress: String,
  city: String,
  state: String,
  zipCode: String,
  phoneNumber: String,
  parametricRatings: {
    type: [Number],
    default: [],
  },
  FAQs: {
    type: [String],
    default: [],
  },
  photos: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  about: {
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  scrapedAverageRating: Number,
  scrapedReviews: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
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
  contactedCustomer: {
    type: Number,
    default: 0,
  },
  mainCategory: {
    type: String,
    default: 'Adult Day Care',
  },
});

const AdultDayCare = mongoose.model('adultDayCare', adultDayCareSchema,'adultDayCare');

module.exports = AdultDayCare;
