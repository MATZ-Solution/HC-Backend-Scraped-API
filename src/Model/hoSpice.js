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

const amenitySchema = new mongoose.Schema({
  // Define your amenity fields here if needed
});

const americanFamilyCareSchema = new mongoose.Schema({
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
  fullAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
  },
  parametricRatings: [parametricRatingSchema],
  scrapedReviews: {
    hospice: [reviewSchema],
  },
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
  photos: [String],
  amenities: amenitySchema,
  about: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
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
    default: 'hoSpiceData',
  },
});

const hoSpice = mongoose.model(
  'hospicesNew',
  americanFamilyCareSchema,
  'hospicesNew'
);

module.exports = hoSpice;
