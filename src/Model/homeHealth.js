const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: {
        type: String,
    },
    fullAddress: {
        type: String
    },
    mainCategory: {
        type: String,
    },
    contactedCustomer: {
        type: Number,
        default:0
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
    service_nursing_care: {
        type: Boolean
    },
    service_physical_therapy: {
        type: Boolean
    },
    service_occupational_therapy: {
        type: Boolean
    },
    service_speech_therapy: {
        type: Boolean
    },
    service_medical_social_service: {
        type: Boolean
    },
    service_home_health_aide: {
        type: Boolean
    },

});

const homeHealthData = mongoose.model('homeHealth', addressSchema);

module.exports = homeHealthData;
