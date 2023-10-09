const mongoose = require('mongoose');

const parametricRatingSchema = new mongoose.Schema({
  type: String,
  stars: Number,
  reviewer_count: Number,
});

const medicareSchema = new mongoose.Schema({
  ratingHealth: Number,
  ratingOverall: Number,
  ratingQuality: Number,
  ratingStaff: Number,
  medicareProviderNumber: String,
  ownershipType: String,
  dateCertified: String,
});

const roomAndHousingOptionsSchema = new mongoose.Schema({
  roomOptions: [String],
  diningOptions: [String],
  languages: [String],
  medicare: [medicareSchema],
  general: [String],
});

const adultCareSchema = new mongoose.Schema({
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
    topRated: {
      type: Boolean,
      default: false,
    },
    qualifiedInYear: String,
    category: String,
  },
  latitude: String,
  longitude: String,
  fullAddress: String,
  city: String,
  state: String,
  zipCode: String,
  phoneNumber: String,
  parametricRatings: [parametricRatingSchema],
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
  photos: [String],
  amenities: [roomAndHousingOptionsSchema],
  about: {
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  scrapedAverageRating: {
    stars: Number,
    reviewer_count: Number,
  },
  scrapedReviews: {
    continuingCareRetirementCommunity: [
      {
        datePublished: String,
        stars: Number,
        author: String,
        title: String,
        description: String,
      },
    ],
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
    default: 'Care Retirement Communities',
  },
});

const careRetirementCommunity = mongoose.model(
  'careRetirementCommunities',
  adultCareSchema,
  'careRetirementCommunities'
);

module.exports = careRetirementCommunity;
