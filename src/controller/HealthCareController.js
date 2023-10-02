const ErrorHandler = require('../utils/ErrorHandler');
const hospital = require('../Model/hospital');
const longTermCares = require('../Model/longtermCares');
const nursingHome = require('../Model/nursingHome');
const dialysisFacilityData = require('../Model/dialysisFacility');
const inpatientRehabilitiation = require('../Model/inpatientRehabilitiaion');
const hoSpiceData = require('../Model/hoSpice');
const groupPracticeData = require('../Model/groupPractice');
const homeHealthData = require('../Model/homeHealth');
const Professional = require('../Model/professional');
const independentLiving = require('../Model/independentLiving');
const Otp = require('../Model/Otp');
const axios = require('axios');
// const Doctor = require("../Model/professional");

const NodeCache = require('node-cache');

const cache = new NodeCache();

const healthCareController = {
  addData: async (req, res, next) => {
    try {
      const data = req.body;

      const newData = [];

      for (let i = 0; i < data.length; i++) {
        const {
          name,
          profile,
          description,
          category,
          phoneNumber,
          address,
          closed,
          openingHours,
        } = data[i];

        const addressData = address.split(',');
        const fullAddress = addressData[0] ? addressData[0].trim() : '';
        const addressParts = fullAddress.split(' ');
        const city = addressParts.pop(); // Removes and returns the last element (city)

        const cityZip = addressData[1] ? addressData[1].trim() : '';

        console.log(description[0]);

        const [state, zipCode] = cityZip.split(' ');

        const newHealthCare = new HealthCare({
          name,
          profile,
          city,
          description: description[0] === undefined ? '' : description[0],
          category: 'Memory Care',
          phoneNumber,
          fullAddress,
          zipCode,
          state: 'California',
          closed,
          openingHours: openingHours[0],
        });

        await newHealthCare.save();
        newData.push(newHealthCare);
      }

      res.status(200).json({
        success: true,
        message: 'Data added successfully',
        data: newData,
      });
    } catch (err) {
      next(err);
    }
  },
  updateData: async (req, res, next) => {
    try {
      const updateCategories = await longTermCares
        .find({ state: 'DC' })
        .lean()
        .select('zipCode latitude longitude state');

      // Loop through the documents and update the "zipCode" field
      for (const category of updateCategories) {
        category.state = 'District of Columbia (DC)';
        category.zipCode = category.zipCode.toString();
        category.latitude = category.latitude.toString();
        category.longitude = category.longitude.toString();
        await longTermCares.findByIdAndUpdate(category._id, {
          $set: {
            zipCode: category.zipCode,
            latitude: category.latitude,
            longitude: category.longitude,
            state: category.state,
            mainCategory: 'hospital',
          },
        });
      }

      res.status(200).json(updateCategories);
    } catch (error) {
      next(error);
    }
  },
  mohinScrap: async (req, res, next) => {
    try {
      const data = req.body; // Assuming req.body contains an array of data objects

      const newData = [];

      for (let i = 0; i < data.length; i++) {
        const {
          name,
          address,
          zip_code,
          city,
          state,
          contact,
          latitude,
          longitude,
          treatment_non_traumatic_brain_condition,
          treatment_traumatic_brain_condition,
          treatment_hip_or_femur_fracture,
          treatment_hip_knee_amputation_bone_join_condition,
          treatment_nervous_system_disorder,
          treatment_non_traumatic_spinal_cord_disease,
          treatment_traumatic_spinal_cord_disease,
          treatment_stroke,
          treatment_miscellaneous_conditions,
        } = data[i];

        const newHealthCare = new inpatientRehabilitiation({
          name,
          fullAddress: address,
          zipCode: zip_code,
          city,
          state: 'Wyoming',
          phoneNumber: contact,
          latitude,
          longitude,
          treatment_non_traumatic_brain_condition,
          treatment_traumatic_brain_condition,
          treatment_hip_or_femur_fracture,
          treatment_hip_knee_amputation_bone_join_condition,
          treatment_nervous_system_disorder,
          treatment_non_traumatic_spinal_cord_disease,
          treatment_stroke,
          treatment_miscellaneous_conditions,
          treatment_traumatic_spinal_cord_disease,
        });

        await newHealthCare.save();
        newData.push(newHealthCare);
      }

      res.status(200).json({
        success: true,
        message: 'Data added successfully',
        data: newData,
      });
    } catch (err) {
      console.log(err);
    }
  },
  filterMultipleCategories: async (req, res, next) => {
    const { state, city, zipCode, name } = req.body;

    try {
      if (typeof name === 'object') {
        const scrapeCategory = async (categoryName) => {
          let query = {};

          if (state) {
            query.state = state;
          }

          if (city) {
            query.city = city;
          }

          if (zipCode) {
            query.zipCode = zipCode;
          }

          let result = [];
          if (categoryName === 'Hospital') {
            result = await hospital
              .find(query)
              .select(
                '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
              )
              .lean();
          } else if (categoryName === 'Dialysis Facility') {
            result = await dialysisFacilityData.find(query).select().lean();
          } else if (categoryName === 'Nursing Home') {
            result = await nursingHome
              .find(query)
              .select()
              .lean()
              .select(
                '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
              );
          } else if (categoryName === 'Long Term Cares') {
            result = await longTermCares
              .find(query)
              .select()
              .lean()
              .select('-quality_reporting');
          } else if (categoryName === 'Hospice') {
            result = await hoSpiceData.find(query).select().lean();
          } else if (categoryName === 'Inpatient Rehabilitiation') {
            result = await inpatientRehabilitiation.find(query).select().lean();
          } else if (categoryName === 'Group Practice') {
            result = await groupPracticeData.find(query).select().lean();
          } else if (categoryName === 'Home Health') {
            result = await homeHealthData.find(query).select().lean();
          } else if (categoryName === 'Independent Living') {
            result = await independentLiving.find(query).select().lean();
          }

          // calculate average rating

          result.forEach((hospital) => {
            if (hospital.reviews && hospital.reviews.length > 0) {
              let totalStars = 0;
              let totalReviews = 0;

              hospital.reviews.forEach((review) => {
                if (review.startRating) {
                  totalStars += review.startRating;
                  totalReviews++;
                }
              });

              if (totalReviews > 0) {
                hospital.averageRating = totalStars / totalReviews;
              } else {
                hospital.averageRating = 0;
              }
            } else {
              hospital.averageRating = 0;
            }
          });

          return result;
        };

        const scrapeAllCategories = async (categories) => {
          const promises = categories.map((categoryName) =>
            scrapeCategory(categoryName)
          );
          const results = await Promise.all(promises);
          return results;
        };

        try {
          const scrapedData = await scrapeAllCategories(name);

          res.status(200).json(scrapedData.flat());
        } catch (err) {
          next(err);
        }
      } else if (typeof name === 'string') {
        const cachedData = cache.get(name);
        if (cachedData) {
          res.status(200).json(cachedData);
          return;
        }

        // If data is not in cache, run query the database
        if (name === 'Hospital') {
          result = await hospital
            .find()
            .lean()
            .select(
              '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            );
        } else if (name === 'Long Term Cares') {
          result = await longTermCares
            .find()
            .lean()
            .select('-quality_reporting');
        } else if (name === 'Nursing Home') {
          result = await nursingHome
            .find()
            .lean()
            .select(
              '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
            );
        } else if (name === 'Dialysis Facility') {
          result = await dialysisFacilityData.find().lean();
        } else if (name === 'Hospice') {
          result = await hoSpiceData.find().lean();
        } else if (name === 'Inpatient Rehabilitiation') {
          result = await inpatientRehabilitiation.find().lean();
        } else if (name === 'Group Practice') {
          result = await groupPracticeData.find().lean();
        } else if (name === 'Home Health') {
          result = await homeHealthData.find().lean();
        } else if (name === 'Independent Living') {
          result = await independentLiving.find().lean();
        } else {
          res.status(200).json('wrong parameter');
          return;
        }

        cache.set(name, result, 365 * 24 * 60 * 60);

        res.status(200).json(result.flat());
      }
    } catch (error) {
      next(error);
    }
  },
  getCategoryData: async (req, res, next) => {
    try {
      const { name } = req.body;
      let result;

      if (typeof name === 'string') {
        const cachedData = cache.get(name);
        if (cachedData) {
          res.status(200).json(cachedData);
          return;
        }

        // If data is not in cache, run query the database
        if (name === 'Hospital') {
          result = await hospital.find().select('state city zipCode ').lean();
        } else if (name === 'Long Term Cares') {
          result = await longTermCares
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Nursing Home') {
          result = await nursingHome.find().select('state city zipCode').lean();
        } else if (name === 'Dialysis Facility') {
          result = await dialysisFacilityData
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Hospice') {
          result = await hoSpiceData.find().select('state city zipCode').lean();
        } else if (name === 'Inpatient Rehabilitiation') {
          result = await inpatientRehabilitiation
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Group Practice') {
          result = await groupPracticeData
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Home Health') {
          result = await homeHealthData
            .find()
            .select('state city zipCode')
            .lean();
        } else if (categoryName === 'Independent Living') {
          result = await independentLiving
            .find()
            .select('state city zipCode')
            .lean();
        } else {
          res.status(200).json('wrong parameter');
          return;
        }

        cache.set(name, result, 365 * 24 * 60 * 60);
      } else if (typeof name === 'object') {
        try {
          const scrapeCategory = async (categoryName) => {
            let result = [];
            if (categoryName === 'Nursing Home') {
              result = await nursingHome
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Long Term Cares') {
              result = await longTermCares
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Dialysis Facility') {
              result = await dialysisFacilityData
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Hospital') {
              result = await hospital
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Hospice') {
              result = await hoSpiceData
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Inpatient Rehabilitiation') {
              result = await inpatientRehabilitiation
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Group Practice') {
              result = await groupPracticeData
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Home Health') {
              result = await homeHealthData
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Independent Living') {
              result = await independentLiving
                .find()
                .select('state city zipCode')
                .lean();
            }

            // Format the data for the list format
            return result.map((entry) => ({
              _id: entry._id,
              state: entry.state,
              city: entry.city,
              zipCode: entry.zipCode,
            }));
          };

          const scrapeAllCategories = async (categories) => {
            const promises = categories.map((categoryName) =>
              scrapeCategory(categoryName)
            );
            const results = await Promise.all(promises);
            return results;
          };

          try {
            const scrapedData = await scrapeAllCategories(name);
            result = scrapedData;
          } catch (err) {
            next(err);
          }
        } catch (err) {
          next(err);
        }
      }

      res.status(200).json(result.flat());
    } catch (err) {
      next(err);
    }
  },
  getHealthCareStateData: async (req, res, next) => {
    try {
      const { name } = req.params;
      let { state, city, zipCode } = req.body;

      let query = {};

      if (state) {
        query.state = state;
      }

      if (city) {
        query.city = city;
      }

      if (zipCode) {
        query.zipCode = zipCode;
      }
      if (name === 'Long Term Cares') {
        let result;
        if (state || city || zipCode) {
          result = await hospital.find(query).lean();
          res.status(200).json(result);
        } else {
          result = 'wrong parameter';
          res.status(200).json({ hospital: result });
        }
      } else if (name === 'longTermCares') {
        let result;
        if (state || city || zipCode) {
          result = await longTermCares
            .find(query)
            .lean()
            .select(
              '_id name fullAddress city state zipCode county_or_parish latitude longitude phoneNumber category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs overall_rating mainCategory'
            );
          res.status(200).json(result);
        } else {
          result = 'wrong parameter';
          res.status(200).json({ longTermCares: result });
        }
      } else if (name === 'nursingHome') {
        let result;
        if (state || city || zipCode) {
          result = await nursingHome.find(query).lean();
          res.status(200).json(result);
        } else {
          result = 'wrong parameter';
          res.status(200).json({ longTermCares: result });
        }
      } else if (name === 'Dialysis Facility') {
        let result;
        if (state || city || zipCode) {
          result = await dialysisFacilityData.find(query).lean();
          res.status(200).json(result);
        } else {
          result = 'wrong parameter';
          res.status(200).json({ longTermCares: result });
        }
      } else if (name === 'Independent Living') {
        result = await independentLiving.find(query).lean();
      } else {
        res.status(200).json('Wrong Category');
      }
    } catch (err) {
      next(err);
    }
  },
  getCategoryName: async (req, res, next) => {
    try {
      const categoryName = [
        'Hospital',
        'Long Term Cares',
        'Nursing Home',
        'Dialysis Facility',
        'Hospice',
        'Inpatient Rehabilitiation',
        'Group Practice',
        'Home Health',
        'Independent Living',
      ];

      res.status(200).json(categoryName);
    } catch (err) {
      next(err);
    }
  },
  getHealthCareZipCodesData: async (req, res, next) => {
    try {
      const { name, zipCode } = req.params;
      if (name === 'memoryCare') {
        let result;
        if (zipCode) {
          result = await HealthCare.aggregate([{ $match: { zipCode } }]);
        } else {
          result = 'wrong parameter';
        }
        res.status(200).json(result);
      } else if (name === 'hospital') {
        let result;
        if (zipCode) {
          result = await hospital.aggregate([{ $match: { zipCode } }]);
        } else {
          result = 'wrong parameter';
        }
        res.status(200).json(result);
      } else if (name === 'longTermCares') {
        let result;
        if (zipCode) {
          result = await longTermCares.aggregate([{ $match: { zipCode } }]);
        } else {
          result = 'wrong parameter';
        }
        res.status(200).json(result);
      } else if (name === 'nursingHome') {
        let result;
        if (zipCode) {
          result = await nursingHome.aggregate([{ $match: { zipCode } }]);
        } else {
          result = 'wrong parameter';
        }
        res.status(200).json(result);
      } else {
        res.status(200).json('wrong params');
      }
    } catch (err) {
      next(err);
    }
  },
  getDataUsingMongoDbId: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.body;

      let data = 'null';

      switch (category) {
        case 'hospital':
          data = await hospital
            .findOne({ _id: mongoDbID })
            .lean()
            .select(
              '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            );
          break;
        case 'longTermCares':
          data = await longTermCares
            .findOne({ _id: mongoDbID })
            .lean()
            .select(
              '_id name fullAddress city state zipCode county_or_parish latitude longitude phoneNumber category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs overall_rating mainCategory'
            );
          break;
        case 'nursingHome': // Both use the same model
          data = await nursingHome
            .findOne({ _id: mongoDbID })
            .lean()
            .select(
              '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
            );
          break;
        case 'dialysisFacilityData': // Both use the same model
          data = await dialysisFacilityData.findOne({ _id: mongoDbID });
          break;
        case 'inpatientRehabilitiation': // Both use the same model
          data = await inpatientRehabilitiation.findOne({ _id: mongoDbID });
          break;
        case 'hoSpiceData': // Both use the same model
          data = await hoSpiceData.findOne({ _id: mongoDbID });
          break;
        case 'groupPracticeData': // Both use the same model
          data = await groupPracticeData.findOne({ _id: mongoDbID });
          break;
        case 'home Health': // Both use the same model
          data = await homeHealthData.findOne({ _id: mongoDbID });
          break;
        case 'professional': // Both use the same model
          data = await Professional.findOne({ _id: mongoDbID });
          break;
        case 'Independent Living':
          data = await independentLiving.find({ _id: mongoDbID }).lean();
        default:
          return res.status(400).json('Invalid category');
      }

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
  incCounterBaseOnTheCustomerContact: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.params;

      switch (category) {
        case 'hospital':
          await hospital.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'longTermCares':
          await longTermCares.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'nursingHome':
          await nursingHome.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'dialysisFacilityData':
          await dialysisFacilityData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'inpatientRehabilitiation':
          await inpatientRehabilitiation.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'hoSpiceData':
          await hoSpiceData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'groupPracticeData':
          await groupPracticeData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'home Health':
          await homeHealthData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'professional':
          await homeHealthData.updateOne(
            { 'locations._id': mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Independent Living':
          await independentLiving.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
        default:
          res.status(400).json({ success: false, message: 'Invalid category' });
      }
    } catch (err) {
      next(err);
    }
  },
  approveReview: async (req, res, next) => {
    try {
      const { mongoDbID, category, name, email, reviews, startRating } =
        req.body;
      switch (category) {
        case 'hospital':
          await hospital.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'longTermCares':
          await longTermCares.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'nursingHome':
          await nursingHome.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'dialysisFacilityData':
          await dialysisFacilityData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'inpatientRehabilitiation':
          await inpatientRehabilitiation.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'hoSpiceData':
          await hoSpiceData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'groupPracticeData':
          await groupPracticeData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'home Health':
          await homeHealthData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'professional':
          await Professional.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        default:
          res.status(400).json({ success: false, message: 'Invalid category' });
      }
    } catch (err) {
      next(err);
    }
  },
  approveComplain: async (req, res, next) => {
    try {
      const { mongoDbID, category, name, email, complain, phoneNumber } =
        req.body;

      // const apiUrl = `http://healthcarebackend-env.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/corporate/addComplainId`;
      const apiUrl = process.env.apiUrl;

      const requestData = {
        mongoDbID,
        phoneNumber,
        category,
      };

      const response = await axios.post(apiUrl, requestData);

      switch (category) {
        case 'hospital':
          await hospital.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'longTermCares':
          await longTermCares.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'nursingHome':
          await nursingHome.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'dialysisFacilityData':
          await dialysisFacilityData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'inpatientRehabilitiation':
          await inpatientRehabilitiation.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'hoSpiceData':
          await hoSpiceData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'groupPracticeData':
          await groupPracticeData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'home Health':
          await homeHealthData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'professional':
          await Professional.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        default:
          res.status(400).json({ success: false, message: 'Invalid category' });
      }
    } catch (err) {
      next(err);
    }
  },
  //get data which is  Nearest to User
  getDataNearestToUser: async (req, res, next) => {
    const { city } = req.body;

    try {
      if (city) {
        const allData = await Promise.all([
          hospital
            .find({ city })
            .lean()
            .select(
              '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            ),
          longTermCares.find({ city }).lean().select('-quality_reporting'),
          nursingHome
            .find({ city })
            .lean()
            .select(
              '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
            ),
          dialysisFacilityData.find({ city }).lean(),
          hoSpiceData.find({ city }).lean(),
          homeHealthData.find({ city }).lean(),
          inpatientRehabilitiation.find({ city }).lean(),
          groupPracticeData.find({ city }).lean(),
          independentLiving.find({ city }).lean(),
        ]);

        let filterData = allData.flat();

        filterData.forEach((hospital) => {
          if (hospital.reviews && hospital.reviews.length > 0) {
            let totalStars = 0;
            let totalReviews = 0;

            hospital.reviews.forEach((review) => {
              if (review.startRating) {
                totalStars += review.startRating;
                totalReviews++;
              }
            });

            if (totalReviews > 0) {
              hospital.averageRating = totalStars / totalReviews;
            } else {
              hospital.averageRating = 0;
            }
          } else {
            hospital.averageRating = 0;
          }
        });

        res.status(200).json(allData.flat());
      } else {
        const allData = await Promise.all([
          hospital.find({ city: 'Andalusia' }).lean(),
          longTermCares.find({ city: 'Andalusia' }).lean(),
          nursingHome.find({ city: 'Andalusia' }).lean(),
          dialysisFacilityData.find({ city: 'Andalusia' }).lean(),
          hoSpiceData.find({ city: 'Andalusia' }).lean(),
          homeHealthData.find({ city: 'Andalusia' }).lean(),
          inpatientRehabilitiation.find({ city: 'Andalusia' }).lean(),
          groupPracticeData.find({ city: 'Andalusia' }).lean(),
          independentLiving.find({ city: 'Andalusia' }).lean(),
        ]);

        let filterData = allData.flat();

        filterData.forEach((hospital) => {
          if (hospital.reviews && hospital.reviews.length > 0) {
            let totalStars = 0;
            let totalReviews = 0;

            hospital.reviews.forEach((review) => {
              if (review.startRating) {
                totalStars += review.startRating;
                totalReviews++;
              }
            });

            if (totalReviews > 0) {
              hospital.averageRating = totalStars / totalReviews;
            } else {
              hospital.averageRating = 0;
            }
          } else {
            hospital.averageRating = 0;
          }
        });

        res.status(200).json(allData.flat());
      }
    } catch (err) {
      next(err);
    }
  },

  //for deletion of cities
  deleteEmptyCities: async (req, res, next) => {
    await hospital.deleteMany({ state: 'North Dakota' });
    res.status(200).json('deleted');
  },

  verifyOtp: async (req, res, next) => {
    const { email, code } = req.body;
    try {
      let data = await Otp.findOne({ email: email, code: code });
      if (data) {
        res.status(200).json({ msg: 'Email Verified' });
      } else {
        throw new ErrorHandler('Invalid OTP', 400);
      }
    } catch (error) {
      next(error);
    }
  },

  //for get all Corporates
  getCorporatesUsingMongoId: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.body;

      switch (category) {
        case 'hospital':
          const hospitalData = await hospital
            .findOne({ _id: mongoDbID })
            .lean()
            .select(
              '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            );
          res.status(200).json(hospitalData);
          break;

        case 'inpatientRehabilitiation':
          const rehabData = await inpatientRehabilitiation.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(rehabData);

          break;

        case 'nursingHome':
          const nursingHomeData = await nursingHome
            .findOne({ _id: mongoDbID })
            .lean()
            .select(
              '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
            );
          res.status(200).json(nursingHomeData);
          break;

        case 'longTermCares':
          const longTermCaresData = await longTermCares
            .findOne({
              _id: mongoDbID,
            })
            .lean()
            .select('-quality_reporting');
          res.status(200).json(longTermCaresData);

          break;

        case 'hoSpiceData':
          const hoSpice = await hoSpiceData.findOne({ _id: mongoDbID });
          res.status(200).json(hoSpice);
          break;

        case 'home Health':
          const homeHealth = await homeHealthData.findOne({ _id: mongoDbID });
          res.status(200).json(homeHealth);

          break;
        case 'groupPracticeData':
          const groupPractice = await groupPracticeData.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(groupPractice);

          break;
        case 'dialysisFacilityData':
          const dialysisFacility = await dialysisFacilityData.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(dialysisFacility);

          break;
        case 'professional':
          const professionalData = await Professional.findOne({
            'locations._id': mongoDbID,
          });
          res.status(200).json(professionalData);
          break;
        case 'Independent Living':
          const result = await independentLiving.findOne({ _id: mongoDbID });
          res.status(200).json(result);
        default:
          res.status(400).json({ message: 'Invalid category' });
          break;
      }
    } catch (error) {
      next(error);
    }
  },

  //find records on the basis of latitude and longitude
  getAllRecordsCategory: async (req, res, next) => {
    try {
      const cacheKey = 'cachedData';

      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        res.status(200).json(cachedData);
      } else {
        const allRecords = await fetchDataFromDatabase();

        cache.set(cacheKey, allRecords, 365 * 24 * 60 * 60);

        res.status(200).json(allRecords);
      }
    } catch (err) {
      next(err);
    }
  },
  //find all  professional Records and apply caching
  getProfessionalCategory: async (req, res, next) => {
    try {
      // const cachedData = cache.get('professionalCategory');

      // if (cachedData) {
      //   console.log('cached');
      //   return res.status(200).json(cachedData);
      // }

      const professionals = await Professional.find();

      // cache.set(
      //   'professionalCategory',
      //   professionals,
      //   365 * 24 * 60 * 60 * 1000
      // );

      return res.status(200).json(professionals);
    } catch (err) {
      next(err);
    }
  },

  //count of all categories
  countAllCatRecords: async (req, res, next) => {
    try {
      const countPromises = [
        hospital.countDocuments().lean(),
        dialysisFacilityData.countDocuments().lean(),
        homeHealthData.countDocuments().lean(),
        hoSpiceData.countDocuments().lean(),
        inpatientRehabilitiation.countDocuments().lean(),
        longTermCares.countDocuments().lean(),
        nursingHome.countDocuments().lean(),
        groupPracticeData.countDocuments().lean(), // Corrected function call
        Professional.countDocuments().lean(),
        independentLiving.countDocuments().lean(),
      ];

      const cachedData = cache.get('countsOfAllCat');

      if (cachedData) {
        return res.status(200).json(cachedData);
      }
      const [
        countHospital,
        countDialysisFacility,
        countHomeHealth,
        countHoSpice,
        countInpatientRehab,
        countLongTermCares,
        countNursingHome,
        groupPracticeCount,
        ProfessionalCount,
        independentLiving,
      ] = await Promise.all(countPromises);

      cache.set(
        'countsOfAllCat',
        {
          hospital: countHospital,
          dialysisFacilityData: countDialysisFacility,
          'home Health': countHomeHealth,
          hoSpiceData: countHoSpice,
          inpatientRehabilitiation: countInpatientRehab,
          longTermCares: countLongTermCares,
          nursingHome: countNursingHome,
          groupPracticeData: groupPracticeCount,
          professional: ProfessionalCount,
          independentLiving,
        },
        365 * 24 * 60 * 60 * 1000
      );

      res.status(200).json({
        hospital: countHospital,
        dialysisFacilityData: countDialysisFacility,
        'home Health': countHomeHealth,
        hoSpiceData: countHoSpice,
        inpatientRehabilitiation: countInpatientRehab,
        longTermCares: countLongTermCares,
        nursingHome: countNursingHome,
        groupPracticeData: groupPracticeCount,
        professional: ProfessionalCount,
        independentLiving,
      });
    } catch (error) {
      next(error);
    }
  },
  //get records on the basis of categories
  getRecordsUsingCat: async (req, res, next) => {
    try {
      const { cat } = req.params;
      const cachedData = cache.get(cat);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      let data;

      switch (cat) {
        case 'dialysisFacilityData':
          data = await dialysisFacilityData.find().lean();
          break;
        case 'hospital':
          data = await hospital
            .find()
            .lean()
            .select(
              '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            );
          break;
        case 'longTermCares':
          data = await longTermCares.find().lean().select('-quality_reporting');
          break;
        case 'nursingHome':
          data = await nursingHome
            .find()
            .lean()
            .select(
              '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
            );
          break;
        case 'inpatientRehabilitiation':
          data = await inpatientRehabilitiation.find().lean();
          break;
        case 'hoSpiceData':
          data = await hoSpiceData.find().lean();
          break;
        case 'groupPracticeData':
          data = await groupPracticeData.find().lean();
          break;
        case 'homeHealthData':
          data = await homeHealthData.find().lean();
          break;
        case 'professional':
          data = await Professional.find().lean();
          break;
        case 'independentLiving':
          data = await independentLiving.find().lean();
        default:
          data = 'Invalid Category';
          break;
      }

      // Cache the data for future requests
      cache.set(cat, data);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};

// Function to fetch data from the database
const fetchDataFromDatabase = async () => {
  const promises = [
    hospital
      .find({})
      .lean()
      .select(
        '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
      ),
    dialysisFacilityData.find({}).lean(),
    homeHealthData.find({}).lean(),
    hoSpiceData.find({}).lean(),
    inpatientRehabilitiation.find({}).lean(),
    longTermCares.find({}).lean().select('-quality_reporting'),
    nursingHome
      .find({})
      .lean()
      .select(
        '_id cms_certification_number name latitude longitude fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
      ),
    independentLiving.find().lean(),
  ];
  const records = await Promise.all(promises);
  return [].concat(...records);
};

module.exports = healthCareController;
