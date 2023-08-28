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
        default:0
    }
});

const GroupPracticeData = mongoose.model('GroupPractice', addressSchema);

module.exports = GroupPracticeData;
