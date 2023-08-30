const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: {
        type: String,
    },
    fullAddress: {
        type: String
    },
    contactedCustomer: {
        type: Number,
        default: 0
    },
    zipCode: {
        type: String,
    },
    city: {
        type: String,
    },
    mainCategory: {
        type: String,
    },
    state: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    family_caregiver_survey_rating: {
        type: String,
    },
    avg_daily_census: {
        type: String,
    },
    condition_cancer_pc: {
        type: Number
    },
    condition_dementia_pc: {
        type: Number
    },
    condition_stroke_pc: {
        type: Number
    },
    condition_heart_circulatory_pc: {
        type: Number
    },
    condition_respiratory_pc: {
        type: Number
    },
    condition_miscellaneous_pc: {
        type: Number
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

const hoSpiceData = mongoose.model('hoSpice', addressSchema);

module.exports = hoSpiceData;
