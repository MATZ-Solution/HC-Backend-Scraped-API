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
  roomAndHousingOptions: {
    type: [String],
  },
  diningOptions: {
    type: [String],
  },
  features: {
    type: [String],
  },
  cleaningServices: {
    type: [String],
  },
  healthServices: {
    type: [String],
  },
  activities: {
    type: [String],
  },
  guestServices: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  general: {
    residentCapacity: {
      type: Number,
    },
    minimumAge: {
      type: Number,
    },
    pets: {
      type: String,
    },
  },
  rangeOfServices: {
    type: [String],
  },
  trainingAreas: {
    type: [String],
  },
  licenses: {
    stateLicenses: {
      type: String,
    },
  },
  costs: {
    assistedLivingStartingAt: {
      type: String,
    },
    memoryCareStartingAt: {
      type: String,
    },
  },
});

const assistedLivingSchema = new mongoose.Schema({
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
      type: String,
    },
    category: {
      type: String,
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
    stars: {
      type: Number,
    },
    reviewer_count: {
      type: Number,
    },
  },
  parametricRatings: [
    {
      type: String,
      stars: Number,
      reviewer_count: Number,
    },
  ],
  reviews: {
    assistedLiving: {
      type: [reviewSchema],
      default: [],
    },
    memoryCare: {
      type: [reviewSchema],
      default: [],
    },
  },
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
  photos: {
    type: [String],
    default: [],
  },
  amenities: {
    type: amenitySchema,
    default: {},
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
    default: 'Assisted Living',
  },
});

const assistedLiving = mongoose.model(
  'assistedLivingMain',
  assistedLivingSchema,
  'assistedLivingMain'
);

module.exports = assistedLiving;
