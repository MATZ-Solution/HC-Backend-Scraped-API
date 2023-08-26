const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: {
        type: String,
    },
    fullAddress: {
        type: String
    },

    zipCode: {
        type: String,
    },
    city: {
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
    quality_rating: {
        type: String,
    },
    patient_survey_rating: {
        type: String,
    },
    hemodialysis_stations_count: {
        type: Number
    },

});

const dialysisFacilityData = mongoose.model('dialysisFacility', addressSchema);

module.exports = dialysisFacilityData;
