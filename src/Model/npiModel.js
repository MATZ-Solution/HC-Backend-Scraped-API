const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const npiSchema = new Schema({
    npiNumber: {
        type: String,
      },
      entityType: {
        type: String,
      },
      ein: {
        type: String,
      },
      replacementNpiNumber: {
        type: String,
      },
      name: {
        type: String,
      },
      alternateName: {
        type: String,
      },
      alternateNameTypeCode: {
        type: String,
      },
      isOrgSubpart: {
        type: String,
      },
      parentOrgLBN: {
        type: String,
      },
      parentOrgTIN: {
        type: String,
      },
      fullAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      countryCode: {
        type: String,
      },
      mailingAddress: {
        type: String,
      },
      mailingCity: {
        type: String,
      },
      mailingState: {
        type: String,
      },
      mailingZipCode: {
        type: String,
      },
      mailingCountryCode: {
        type: String,
      },
      phoneNumber: {
        type: [String],
      },
      faxNumbers: {
        type: [String],
      },
      enumerationDate: {
        type: String,
      },
      lastUpdateDate: {
        type: String,
      }
    });
// addressSchema.indexes({
//   longitude:"2dsphere",
//   latitude:"2dsphere"
// })
// const hospitals = mongoose.model('hospitalnew', addressSchema, 'hospitalnew');
npiSchema.index({ location: '2dsphere' });

const npihomes = mongoose.model(
  'npi',
  npiSchema,
  'npi'
);
// nursinghomes.updateMany({},{
//   $set:{
//     longitude:{$convert:{input:"$longitude",to:"double"}},
//     latitude:{$convert:{input:"$latitude",to:"double"}}

//   }
// })
// nursinghomes.createIndexes({
//   longitude:"2dsphere",
//   latitude:"2dsphere"
// })
// nursinghomes.index({
//   "location":"2dsphere"
// })
module.exports = npihomes;
