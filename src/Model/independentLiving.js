const mongoose = require('mongoose');

const IndependentLivingSchema = new mongoose.Schema({
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
    qualifiedInYear: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
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
    default: null,
  },
  parametricRatings: {
    type: [Number],
    default: [],
  },
  reviews: {
    type: Object,
    default: {},
  },
  FAQs: {
    type: Array,
    default: [],
  },
  photos: {
    type: Array,
    default: [],
  },
  amenities: {
    type: Array,
    default: [],
  },
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

const independentLiving = mongoose.model('IndependentLivingSchema', IndependentLivingSchema);

module.exports = independentLiving;
