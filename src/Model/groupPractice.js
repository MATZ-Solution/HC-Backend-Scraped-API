const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
  },
  state: {
    type: String
  },
  specialities: {
    type: Array,
  },
  mainCategory: {
    type: String,
  },
  contactedCustomer: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      name: { type: String },
      email: { type: String },
      reviews: { type: String },
      startRating: { type: Number },
      date: { type: Date, default: Date.now }

    }
  ],
  complain: [
    {
      name: { type: String },
      email: { type: String },
      complain: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

const GroupPracticeData = mongoose.model('GroupPractice', addressSchema);

module.exports = GroupPracticeData;
