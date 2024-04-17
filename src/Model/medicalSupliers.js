const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalSuppliersSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      offerings: {
        type: [String],
        required: true,
      },
      amenities:[
        {}
      ],
      caringStars: {
        isTopRated: {
          type: Boolean,
          default: false,
        },
        qualifiedInYear: String,
        category: String,
      },
      latitude: {
        type: String,
        required: true,
        // index:"2dsphere"
      },
      longitude: {
        type: String,
        required: true,
        // index:"2dsphere"
      },
      location: {
        type: {
          type: String,
          enum: ['Point'], // Only 'Point' is allowed
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
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
      },
    //   scrapedReviews: {
    //     homeCare: [reviewSchema],
    //   },
      FAQs: [
        {
          question: String,
          answer: String,
        },
      ],
      photos: [String],
      amenities:[
        {}
      ],
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
        default: 'medicareSupplier',
      },
});
medicalSuppliersSchema.index({ location: '2dsphere' });
const medicalSuppliersData = mongoose.model(
  'medicalSuppliers',
  medicalSuppliersSchema,
  'medicalSuppliers',

);
// inpatientRehabilitiationData.updateMany({},{
//   $set:{
//     longitude:{$convert:{input:"$longitude",to:"double"}},
//     latitude:{$convert:{input:"$latitude",to:"double"}}

//   }
// })
// inpatientRehabilitiationData.createIndexes({
//   longitude:"2dsphere",
//   latitude:"2dsphere"
// })
module.exports = medicalSuppliersData;
