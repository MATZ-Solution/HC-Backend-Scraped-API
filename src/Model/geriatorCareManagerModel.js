const mongoose = require('mongoose');

const parametricRatingSchema = new mongoose.Schema({
  type: String,
  stars: Number,
  reviewer_count: Number,
});
const reviewSchema = new mongoose.Schema({
  datePublished: {
    type: Date,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const licenseSchema = new mongoose.Schema({
  licenses: String,
});

const locationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  fullAddress: String,
  city: String,
  state: String,
  zipCode: String,
});

const caringStarsSchema = new mongoose.Schema({
  isTopRated: Boolean,
  qualifiedInYear: Number, // or Date if representing a year
  category: String,
});

const geriatricCareManagerSchema = new mongoose.Schema({
  mainCategory: String,
  name: String,
  offerings: [String],
  caringStars: caringStarsSchema,
  location: locationSchema,
  phoneNumber: String,
  parametricRatings: [parametricRatingSchema],
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
  photos: [String],
  amenities: [
    {
      licenses: [licenseSchema],
    },
  ],
  about: {
    title: String,
    description: String,
  },
  scrapedAverageRating: {
    // null in this example, modify as needed
    stars: Number,
    reviewer_count: Number,
  },
  scrapedReviews: {
    geriaticCareManager: [reviewSchema],
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
    default: 'Independent Living',
  }, // empty object in this example, modify as needed
});

const GeriatricCareManager = mongoose.model(
  'geriaticCareManager',
  geriatricCareManagerSchema,
  'geriaticCareManager'
);

module.exports = GeriatricCareManager;
