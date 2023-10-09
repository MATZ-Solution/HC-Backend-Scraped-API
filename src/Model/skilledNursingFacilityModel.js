const mongoose = require('mongoose');

const scrapedReviewSchema = new mongoose.Schema({
  datePublished: String,
  stars: Number,
  author: String,
  title: String,
  description: String,
});

const parametricRatingSchema = new mongoose.Schema({
  type: String,
  stars: Number,
  reviewer_count: Number,
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

const nursingHomeSchema = new mongoose.Schema({
  mainCategory: String,
  name: String,
  offerings: [String],
  caringStars: caringStarsSchema,
  location: locationSchema,
  phoneNumber: String,
  scrapedAverageRating: {
    stars: Number,
    reviewer_count: Number,
  },
  parametricRatings: [parametricRatingSchema],
  scrapedReviews: {
    nursingHome: [scrapedReviewSchema],
  },
  FAQs: [
    {
      question: String,
      answer: String,
    },
  ],
  photos: [String],
  amenities: [
    {
      medicare: [
        {
          ratingHealth: Number,
        },
      ],
      general: [
        {
          residentCapacity: String,
        },
      ],
    },
  ],
  about: {
    title: String,
    description: String,
  },
});

const NursingHome = mongoose.model(
  'skilledNursingFacility',
  nursingHomeSchema,
  'skilledNursingFacility'
);

module.exports = NursingHome;
