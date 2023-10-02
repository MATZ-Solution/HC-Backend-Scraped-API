const mongoose = require('mongoose');

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
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
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
  parametricRatings: [
    {
      type: String,
      stars: Number,
      reviewer_count: Number,
    },
  ],
  reviewss: {
    type: reviewSchema,
    default: {},
  },
  FAQs: [String],
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
});

const inHomeCare = mongoose.model('inHomeCare', americanFamilyCareSchema,'inHomeCare');

module.exports = inHomeCare;
