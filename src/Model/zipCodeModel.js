// models/zipCodeModel.js
const mongoose = require('mongoose');

const zipCodeSchema = new mongoose.Schema({
  state: String,
  city: String,
  zipCode: String,
});

module.exports = mongoose.model('allZipCodes', zipCodeSchema, 'allZipCodeUs'); 
// Explicit collection name
