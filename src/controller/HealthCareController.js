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
const memoryCare = require('../Model/memoryCareModel');
const inHomeCare = require('../Model/inHomeCare');
const assistedLiving = require('../Model/assistedLiving');
const nursingHomeNew = require('../Model/nursingHomeNewMode');
const adultDayCare = require('../Model/adultDayCareModel');
const careRetirement = require('../Model/careRetirementCommunities');
const skilledNursingHome = require('../Model/skilledNursingFacilityModel');
const geriaticCareManager = require('../Model/geriatorCareManagerModel');
const providerData=require('../Model/Providers');
const allState=require('../Model/statesModel')
const allCities=require('../Model/citiesModel')
const Otp = require('../Model/Otp');
const axios = require('axios');
const turf = require("@turf/turf");
// const Doctor = require("../Model/professional");
const allZipCode =require('../Model/zipCodeModel')
const NodeCache = require('node-cache');
const medicalFacilities = require('../Model/medicalFacilities');
const medicalSuppliers = require('../Model/medicalSupliers');
const physicians = require('../Model/pysicianModel');

const cache = new NodeCache();
const getCategoryModel = (categoryName) => {
    switch (categoryName) {
        case 'Nursing Home':
            return nursingHome;
        case 'Inpatient Rehabilitiation':
            return inpatientRehabilitiation;
        case 'In Home Care':
            return inHomeCare;
        case 'Memory Care':
            return memoryCare;
        // case 'HoSpice':
        //     return hoSpiceData;  
        // case 'Hospital':
        //     return hospital;
        // case 'Dialysis Facility':
        //     return dialysisFacilityData
        // case 'Home Health':
        //     return homeHealthData

        // case 'Medicare Supplier':
        //     return medicalSuppliers;
        // case 'Medicare Facility':
        //     return medicalFacilities;
        //     case 'physician':
        //     return physicians;
        // case "skilled":
        //     return skilledNursingHome
        default:
            throw new Error(`Invalid category name: ${categoryName}`);
    }
}
const createGeoPolygon = (points) => {
  return {
      type: "Polygon",
      coordinates: [points.map(([lat, lng]) => [lng, lat])]
  };
};
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

        // console.log(description[0]);

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
      // console.log('Updated run');
      // const updateResult = await independentLiving.updateMany(
      //   {},
      //   { $set: { mainCategory: 'Independent Living' } }
      // );
      // console.log(`${updateResult} records updated.`);

      // const updatedResult = await independentLiving.find().lean();
      // console.log(updatedResult.length);

      // for (let index = 0; index < updatedResult.length; index++) {
      //   updatedResult[index].mainCategory = 'Independent Living';
      //   await updatedDocument.save();
      // }

      const updateCategories = await assistedLiving
        .find({})
        .lean()
        .select('_id');

      // console.log(updateCategories.length);
      // Loop through the documents and update the "zipCode" field
      for (const category of updateCategories) {
        // category.state = 'District of Columbia (DC)';
        // category.zipCode = category.zipCode.toString();
        // category.latitude = category.latitude.toString();
        // category.longitude = category.longitude.toString();
        await assistedLiving.findByIdAndUpdate(category._id, {
          $set: {
            // zipCode: category.zipCode,
            // latitude: category.latitude,
            // longitude: category.longitude,
            // state: category.state,
            mainCategory: 'Assisted Living',
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
                '_id latitude longitude cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
              );
          } else if (categoryName === 'Long Term Cares') {
            result = await longTermCares
              .find(query)
              .select()
              .lean()
              .select('-quality_reporting');
          } else if (categoryName === 'Hospice') {
            result = await hoSpiceData
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Inpatient Rehabilitiation') {
            result = await inpatientRehabilitiation.find(query).select().lean();
          } else if (categoryName === 'Group Practice') {
            result = await groupPracticeData.find(query).select().lean();
          } else if (categoryName === 'Home Health') {
            result = await homeHealthData.find(query).select().lean();
          } else if (categoryName === 'Independent Living') {
            result = await independentLiving
              .find(query)
              .select()
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Memory Care') {
            result = await memoryCare
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'In Home Care') {
            result = await inHomeCare
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Assisted Living') {
            result = await assistedLiving
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Adult Day Care') {
            result = await adultDayCare
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Care Retirement Communities') {
            result = await careRetirement
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Skilled Nursing Facility') {
            result = await skilledNursingHome
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
          } else if (categoryName === 'Geriatic Care Manager') {
            result = await skilledNursingHome
              .find(query)
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              );
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
          result = await hoSpiceData
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews.hospice FAQs mainCategory photos about.description'
            );
        } else if (name === 'Inpatient Rehabilitiation') {
          result = await inpatientRehabilitiation.find().lean();
        } else if (name === 'Group Practice') {
          result = await groupPracticeData.find().lean();
        } else if (name === 'Home Health') {
          result = await homeHealthData.find().lean();
        } else if (name === 'Independent Living') {
          result = await independentLiving
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Memory Care') {
          result = await memoryCare
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'In Home Care') {
          result = await inHomeCare
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Assisted Living') {
          result = await assistedLiving
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Adult Day Care') {
          result = await adultDayCare
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Care Retirement Communities') {
          result = await careRetirement
            .find(query)
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Skilled Nursing Facility') {
          result = await skilledNursingHome
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
        } else if (name === 'Geriatic Care Manager') {
          result = await skilledNursingHome
            .find()
            .lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            );
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
        } else if (name === 'Independent Living') {
          console.log('hit');
          result = await independentLiving
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Memory Care') {
          result = await memoryCare.find().select('state city zipCode').lean();
        } else if (name === 'In Home Care') {
          result = await inHomeCare.find().select('state city zipCode').lean();
        } else if (name === 'Assisted Living') {
          result = await assistedLiving
            .find()
            .select('state city zipCode')
            .lean();
        } else if (name === 'Adult Day Care') {
          result = await adultDayCare
            .find()
            .lean()
            .select('city state zipCode');
        } else if (name === 'Care Retirement Communities') {
          result = await careRetirement
            .find()
            .lean()
            .select('city state zipCode');
        } else if (name === 'Skilled Nursing Facility') {
          result = await skilledNursingHome
            .find()
            .lean()
            .select('city state zipCode');
        } else if (name === 'Geriatic Care Manager') {
          result = await geriaticCareManager
            .find()
            .lean()
            .select('city state zipCode');
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
            } else if (categoryName === 'Memory Care') {
              result = await memoryCare
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'In Home Care') {
              result = await inHomeCare
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Assisted Living') {
              result = await assistedLiving
                .find()
                .select('state city zipCode')
                .lean();
            } else if (categoryName === 'Adult Day Care') {
              result = await adultDayCare
                .find()
                .lean()
                .select('city state zipCode ');
            } else if (categoryName === 'Care Retirement Communities') {
              result = await careRetirement
                .find()
                .lean()
                .select('city state zipCode');
            } else if (categoryName === 'Skilled Nursing Facility') {
              result = await skilledNursingHome
                .find()
                .lean()
                .select('city state zipCode');
            } else if (categoryName === 'Geriatic Care Manager') {
              result = await geriaticCareManager
                .find()
                .lean()
                .select('city state zipCode');
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
        result = await independentLiving
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
        res.status(200).json({ independentLiving: result });
      } else if (name === 'Memory Care') {
        result = await memoryCare
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'In Home Care') {
        result = await inHomeCare
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'Assisted Living') {
        result = await assistedLiving
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'Adult Day Care') {
        result = await adultDayCare
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'Care Retirement Communities') {
        result = await careRetirement
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'Skilled Nursing Facility') {
        result = await skilledNursingHome
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
      } else if (name === 'Geriatic Care Manager') {
        result = await geriaticCareManager
          .find(query)
          .lean()
          .select(
            'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          );
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
        'Nursing Home',
        // 'Skilled Nursing Facility',
        
        // 'Long Term Cares',
        
        'Inpatient Rehabilitiation',
        // 'Group Practice',
        
        // 'Independent Living',
        'Memory Care',
        'Home Health',
        'In Home Care',
        'Dialysis Facility',
        'HoSpice',
        'Hospital',
        // 'Assisted Living',
        // 'Adult Day Care',
        // 'Care Retirement Communities',
        // 'Geriatic Care Manager',
        // "Medical Facilities",
        // "Medical Suppliers",
        // "Physician"
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
          data = await hospital.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
          // );
          break;
        case 'longTermCares':
          data = await longTermCares.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   '_id name fullAddress city state zipCode county_or_parish latitude longitude phoneNumber category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs overall_rating mainCategory'
          // );
          break;
        case 'nursingHome': // Both use the same model
          data = await nursingHome.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   '_id cms_certification_number name fullAddress city state zipCode phoneNumber provider_ssa_county_code county_or_parish ownership_type number_of_certified_beds average_number_of_residents_per_day average_number_of_residents_per_day_footnote provider_type provider_resides_in_hospital legal_business_name date_first_approved_to_provide_medicare_and_medicaid_services affiliated_entity_name affiliated_entity_id mainCategory'
          // );
          break;
        case 'dialysisFacilityData': // Both use the same model
          data = await dialysisFacilityData.findOne({ _id: mongoDbID });
          break;
        case 'inpatientRehabilitiation': // Both use the same model
          data = await inpatientRehabilitiation.findOne({ _id: mongoDbID });
          break;
        case 'hoSpiceData': // Both use the same model
          data = await hoSpiceData.findOne({ _id: mongoDbID });
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
          // );
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
          data = await independentLiving.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;
        case 'Memory Care':
          data = await memoryCare.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;
        case 'In Home Care':
          data = await inHomeCare.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;

        case 'Assisted Living':
          data = await assistedLiving.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;

        case 'Adult Day Care':
          data = await adultDayCare.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;

        case 'Care Retirement Communities':
          data = await careRetirement.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;

        case 'Skilled Nursing Facility':
          data = await skilledNursingHome.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;
        case 'Geriatic Care Manager':
          data = await geriaticCareManager.findOne({ _id: mongoDbID }).lean();
          // .select(
          //   'name latitude longitude fullAddress city state zipCode phoneNumber _id mainCategory'
          // );
          break;

        default:
          // console.log(category)
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
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Memory Care':
          await memoryCare.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'In Home Care':
          await inHomeCare.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Assisted Living':
          await assistedLiving.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Adult Day Care': {
          await adultDayCare.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        }
        case 'Care Retirement Communities':
          await careRetirement.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Skilled Nursing Facility':
          await skilledNursingHome.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Geriatic Care Manager':
          await geriaticCareManager.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
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
        case 'Memory Care':
          await memoryCare.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'In Home Care':
          await inHomeCare.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: 'Updated' });
          break;
        case 'Assisted Living':
          await assistedLiving.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          break;
        case 'Adult Day Care':
          await adultDayCare.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          break;
        case 'Care Retirement Communities':
          await careRetirement.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          break;
        case 'Skilled Nursing Facility':
          await skilledNursingHome.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          break;
        case 'Geriatic Care Manager':
          await geriaticCareManager.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
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
    try {
      const { city, type } = req.body;
      // console.log(type=="all","type")
      if (type == "all") {
        if (city) {


          const allData = await Promise.all([
            hospital
              .find({ city })
              .lean()
              .select(
                '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
              ),
            // longTermCares.find({ city }).lean().select('-quality_reporting'),
            Professional.aggregate([
              {
                $unwind: "$locations",
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  mainCategory: 1,
                  state: 1,
                  specialities: 1,
                  zipCode: "$locations.zip_code",
                  city: "$locations.city",
                  latitude: "$locations.latitude",
                  longitude: "$locations.longitude",
                },
              },
              {
                $match: {
                  city: city,
                },
              },
            ]),

            nursingHome
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            dialysisFacilityData.find({ city }).lean(),
            hoSpiceData
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            homeHealthData.find({ city }).lean(),
            inpatientRehabilitiation.find({ city }).lean().select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
            ),
            // groupPracticeData.find({ city }).lean(),
            // independentLiving
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            memoryCare
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            inHomeCare
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            // assistedLiving
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // adultDayCare
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // careRetirement
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // skilledNursingHome
            //   .find({ city })
            //   .lean()
            //   .select(
            //     '_id name latitude longitude mainCategory city state zipCode'
            //   ),
            // geriaticCareManager
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
          ]);




          // let filterData = allData.flat();

          // filterData.forEach((hospital) => {
          //   if (hospital.reviews && hospital.reviews.length > 0) {
          //     let totalStars = 0;
          //     let totalReviews = 0;

          //     hospital.reviews.forEach((review) => {
          //       if (review.startRating) {
          //         totalStars += review.startRating;
          //         totalReviews++;
          //       }
          //     });

          //     if (totalReviews > 0) {
          //       hospital.averageRating = totalStars / totalReviews;
          //     } else {
          //       hospital.averageRating = 0;
          //     }
          //   } else {
          //     hospital.averageRating = 0;
          //   }
          // });

          res.status(200).json(allData.flat());
        }
        else {
          const allData = await Promise.all([
            hospital.find({ city: 'Andalusia' }).lean(),
            // longTermCares.find({ city: 'Andalusia' }).lean(),
            nursingHome.find({ city: 'Andalusia' }).lean().select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
            ),
            dialysisFacilityData.find({ city: 'Andalusia' }).lean(),
            hoSpiceData
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            homeHealthData.find({ city: 'Andalusia' }).lean(),
            inpatientRehabilitiation.find({ city: 'Andalusia' }).lean()
            .select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
            ),
            // groupPracticeData.find({ city: 'Andalusia' }).lean(),
            // independentLiving
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            memoryCare
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            inHomeCare
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            // assistedLiving
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // adultDayCare
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // careRetirement
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // skilledNursingHome
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     '_id name latitude longitude mainCategory city state zipCode'
            //   ),
            // geriaticCareManager
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
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
      }
      else if (type == "facility") {
        if (city) {


          const allData = await Promise.all([
            // hospital
            //   .find({ city })
            //   .lean()
            //   .select(
            //     '_id name city state zipCode county_or_parish latitude longitude phoneNumber  category hospital_ownership emergency_services meets_criteria_for_promoting_interoperability_of_ehrs hospital_overall_rating fullAddress mainCategory'
            //   ),
            // longTermCares.find({ city }).lean().select('-quality_reporting'),
            // Professional.aggregate([
            //   {
            //     $unwind: "$locations",
            //   },
            //   {
            //     $project: {
            //       _id: 1,
            //       name: 1,
            //       mainCategory: 1,
            //       state: 1,
            //       specialities: 1,
            //       zipCode: "$locations.zip_code",
            //       city: "$locations.city",
            //       latitude: "$locations.latitude",
            //       longitude: "$locations.longitude",
            //     },
            //   },
            //   {
            //     $match: {
            //       city: city,
            //     },
            //   },
            // ]),

            nursingHome
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            dialysisFacilityData.find({ city }).lean(),
            hoSpiceData
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            homeHealthData.find({ city }).lean(),
            inpatientRehabilitiation.find({ city }).lean().select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            ),
            // groupPracticeData.find({ city }).lean(),
            // independentLiving
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            memoryCare
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            inHomeCare
              .find({ city })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            // assistedLiving
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // adultDayCare
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // careRetirement
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // skilledNursingHome
            //   .find({ city })
            //   .lean()
            //   .select(
            //     '_id name latitude longitude mainCategory city state zipCode about'
            //   ),
            // skilledNursingHome.aggregate([
            //   {
            //     $unwind:"$about"
            //   },
            //   {
            //     $project:{
            //       _id:1,
            //       name:1,
            //       latitude:1,
            //       longitude:1,
            //       mainCategory:1,
            //       city:1,
            //       state:1,
            //       zipCode:1,
            //       description:"$about.description"
            //     }

            //   },
            //   {
            //     $match:{
            //       city:city
            //     }
            //   }
            // ]),
            // geriaticCareManager
            //   .find({ city })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
          ]);




          // let filterData = allData.flat();

          // filterData.forEach((hospital) => {
          //   if (hospital.reviews && hospital.reviews.length > 0) {
          //     let totalStars = 0;
          //     let totalReviews = 0;

          //     hospital.reviews.forEach((review) => {
          //       if (review.startRating) {
          //         totalStars += review.startRating;
          //         totalReviews++;
          //       }
          //     });

          //     if (totalReviews > 0) {
          //       hospital.averageRating = totalStars / totalReviews;
          //     } else {
          //       hospital.averageRating = 0;
          //     }
          //   } else {
          //     hospital.averageRating = 0;
          //   }
          // });

          res.status(200).json(allData.flat());
        }
        else {
          const allData = await Promise.all([
            // hospital.find({ city: 'Andalusia' }).lean(),
            // longTermCares.find({ city: 'Andalusia' }).lean(),
            nursingHome.find({ city: 'Andalusia' }).lean().select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
            ),
            dialysisFacilityData.find({ city: 'Andalusia' }).lean(),
            hoSpiceData
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
              ),
            homeHealthData.find({ city: 'Andalusia' }).lean(),
            inpatientRehabilitiation.find({ city: 'Andalusia' }).lean().select(
              'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
            ),
            // groupPracticeData.find({ city: 'Andalusia' }).lean(),
            // independentLiving
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            memoryCare
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            inHomeCare
              .find({ city: 'Andalusia' })
              .lean()
              .select(
                'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about overall_rating'
              ),
            // assistedLiving
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // adultDayCare
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // careRetirement
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
            // skilledNursingHome
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     '_id name latitude longitude mainCategory city state zipCode'
            //   ),
            // geriaticCareManager
            //   .find({ city: 'Andalusia' })
            //   .lean()
            //   .select(
            //     'name latitude longitude fullAddress city state zipCode phoneNumber _id scrapedReviews FAQs mainCategory photos about'
            //   ),
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
      }

    } catch (err) {
      next(err);
    }
  },
   getDataUsingZipCode: async (req, res, next) => {
    try {
      const { zipCode } = req.params;

      if (zipCode) {
        const allData = await Promise.all([
          nursingHome.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude overall_rating'),
          // skilledNursingHome.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // hospital.find({ zipCode }).lean(),
          // longTermCares.find({ zipCode }).lean(),
          // dialysisFacilityData.find({ zipCode }).lean(),
          // hoSpiceData.find({ zipCode }).lean(),
          // homeHealthData.find({ zipCode }).lean(),
          inpatientRehabilitiation.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // groupPracticeData.find({ zipCode }).lean(),
          // independentLiving.find({ zipCode }).lean(),
          memoryCare.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          inHomeCare.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // assistedLiving.find({ zipCode }).lean(),
          // adultDayCare.find({ zipCode }).lean(),
          // careRetirement.find({ zipCode }).lean(),
          // geriaticCareManager.find({ zipCode }).lean(),
        ]);
        res.status(200).json(allData.flat());
      }
    } catch (err) {
      next(err);
    }
  },
   getProviderDataUsingZipCode: async (req, res, next) => {
    try {
      const { zipCode } = req.params;

      if (zipCode) {
        const allData = await Promise.all([
          providerData.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber overall_rating images'),
          // nursingHome.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude overall_rating'),
          // skilledNursingHome.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // hospital.find({ zipCode }).lean(),
          // longTermCares.find({ zipCode }).lean(),
          // dialysisFacilityData.find({ zipCode }).lean(),
          // hoSpiceData.find({ zipCode }).lean(),
          // homeHealthData.find({ zipCode }).lean(),
          // inpatientRehabilitiation.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // groupPracticeData.find({ zipCode }).lean(),
          // independentLiving.find({ zipCode }).lean(),
          // memoryCare.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // inHomeCare.find({ zipCode }).lean().select('_id name  mainCategory city state zipCode fullAddress phoneNumber latitude longitude'),
          // assistedLiving.find({ zipCode }).lean(),
          // adultDayCare.find({ zipCode }).lean(),
          // careRetirement.find({ zipCode }).lean(),
          // geriaticCareManager.find({ zipCode }).lean(),
        ]);
        res.status(200).json(allData.flat());
      }
    } catch (err) {
      next(err);
    }
  },
  // filterZipCode:async(req,res)=>{
  //   try{ 

  //     const {zipCode}=req.body
    
   

        
  //       const regex = new RegExp(zipCode, 'i');
        
  //       const allData = await Promise.all([
  //         nursingHome.find({ zipCode: { $regex: regex } }).lean(),
  //         skilledNursingHome.find({ zipCode: { $regex: regex } }).lean(),
  //          // hospital.find({ zipCode: { $regex: regex } }).lean(),
  //         // longTermCares.find({ zipCode: { $regex: regex } }).lean(),
  //         // dialysisFacilityData.find({ zipCode: { $regex: regex } }).lean(),
  //         // hoSpiceData.find({ zipCode }).lean(),
  //         // homeHealthData.find({ zipCode: { $regex: regex } }).lean(),
  //         inpatientRehabilitiation.find({ zipCode: { $regex: regex } }).lean(),
  //         // groupPracticeData.find({ zipCode: { $regex: regex } }).lean(),
  //         // independentLiving.find({ zipCode: { $regex: regex } }).lean(),
  //         // memoryCare.find({ zipCode: { $regex: regex } }).lean(),
  //         inHomeCare.find({ zipCode: { $regex: regex } }).lean(),
  //         // assistedLiving.find({ zipCode: { $regex: regex } }).lean(),
  //         // adultDayCare.find({ zipCode: { $regex: regex } }).lean(),
  //         // careRetirement.find({ zipCode: { $regex: regex } }).lean(),
  //         // geriaticCareManager.find({ zipCode: { $regex: regex } }).lean(),
          
  //       ]);
        
  //       const flattenedData = allData.flat();
        
  //       const sortedZipCodes = flattenedData.map((e) => e.zipCode).sort((a, b) => a.localeCompare(b));

  // res.status(200).json(sortedZipCodes);
  //     }
      
  //   catch(err){
  //     next(err)
  //   }
  // },
  // filterZipCode:async(req,res,next)=>{
  //   try {
  //     const { zipCode, page , limit } = req.params;
  //     // console.log(zipCode,"data")
  //     const regex = new RegExp(zipCode, 'i');
    
  //     const pipeline = [
  //       {
  //         $match: { zipCode: { $regex: regex } }
  //       },
  //       {
  //         $sort: { zipCode: 1 } 
  //       },
  //       {
  //         $skip: (parseInt(page ) - 1) * parseInt(limit) 
  //       },
  //       {
  //         $limit: parseInt(limit) 
  //       }
  //     ];
    
  //     const nursingHomeData = await nursingHome.aggregate(pipeline)
    
  //     // const skilledNursingHomeData = await skilledNursingHome.aggregate(pipeline)
  //     // const hospitaleData = await hospital.aggregate(pipeline)
  //     // const longTermCaresData = await longTermCares.aggregate(pipeline)
  //     // const dialysisFacilityDataData = await dialysisFacilityData.aggregate(pipeline)
  //     // const hoSpiceDataData = await hoSpiceData.aggregate(pipeline)
  //     // const homeHealthDataData = await homeHealthData.aggregate(pipeline)
      
  //     const inpatientRehabilitationData = await inpatientRehabilitiation.aggregate(pipeline)
  //     const inHomeCareData = await inHomeCare.aggregate(pipeline)
  //     // const groupPracticeDataData= await groupPracticeData.aggregate(pipeline)
  //     // const independentLivingData= await independentLiving.aggregate(pipeline)
  //     const memoryCareData=await memoryCare.aggregate(pipeline)
  //     // const medicalFacilitiesData=await medicalFacilities.aggregate(pipeline)
  //     // const medicalSuppliersData=await medicalSuppliers.aggregate(pipeline)
  //     // const physicianData=await physicians.aggregate(pipeline)
  //     // const homeHealthData=await homeHealthData.aggregate(pipeline)
  //     // const assistedLivingData=await assistedLiving.aggregate(pipeline)
  //     // const adultDayCareData=await adultDayCare.aggregate(pipeline)
  //     // const careRetirementData=await careRetirement.aggregate(pipeline)
  //     // const geriaticCareManagerData=await geriaticCareManager.aggregate(pipeline)
    
  //     // const mergedData = [...nursingHomeData, ...memoryCareData, ...inpatientRehabilitationData, ...inHomeCareData,...medicalSuppliersData,...medicalFacilitiesData,...physicianData];
  //     const mergedData = [...nursingHomeData, ...memoryCareData, ...inpatientRehabilitationData, ...inHomeCareData];
    
  //   // Extract unique zip codes using a Set
  //   const uniqueZipCodes = new Set(mergedData.map((e) => e.zipCode));

  //   // Convert the Set back to an array
  //   const uniqueZipCodesArray = [...uniqueZipCodes];

  //   // Sort the array if needed
  //   const sortedData = uniqueZipCodesArray.sort();

  //   res.status(200).json(sortedData);
  //   } catch (err) {
  //     next(err);
  //   }
    
  // },
  
  filterZipCode: async (req, res, next) => {
    console.log(req,"rq")
   try {
  const { zipCode ="" , page = 1 } = req.query;
  console.log(zipCode,"query")
  const limit = 5;
  const skip = (parseInt(page) - 1) * limit;
  let notFound = false;

  const pipeline = [];

  // Match search query against zipCode, city, or state
  if (zipCode) {
    console.log("dsd")
    const regex = new RegExp(zipCode, 'i'); // <-- Fix: use zipCode here
    // const regex = new RegExp(search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { zipCode: { $regex: regex } },
          { state: { $regex: regex } },
          { city: { $regex: regex } },
        ],
      },
    });
  }

  // Group by zipCode + city + state to avoid duplicates
  pipeline.push({
    $group: {
      _id: {
        zipCode: { $toLower: '$zipCode' },
        city: { $toLower: '$city' },
        state: { $toLower: '$state' },
      },
    },
  });

  // Project required fields
  pipeline.push({
    $project: {
      _id: 0,
      zipCode: '$_id.zipCode',
      city: '$_id.city',
      state: '$_id.state',
    },
  });

  // Sort by zipCode
  pipeline.push({ $sort: { zipCode: 1 } });

  // Pagination
  pipeline.push({ $skip: skip }, { $limit: limit });

  // Query from allZipCodeUs collection
  let result = await allZipCode.aggregate(pipeline);
  console.log(result,"result")

  if (result.length === 0) {
    notFound = true;

    // Try partial match using first 3 chars of zipCode if it's a full 5-digit zip
    if (/^\d{5}$/.test(zipCode)) {
      const similarPipeline = [
        {
          $match: {
            zipCode: { $regex: new RegExp('^' + zipCode.substring(0, 3), 'i') },
          },
        },
        {
          $group: {
            _id: {
              zipCode: { $toLower: '$zipCode' },
              city: { $toLower: '$city' },
              state: { $toLower: '$state' },
            },
          },
        },
        {
          $project: {
            _id: 0,
            zipCode: '$_id.zipCode',
            city: '$_id.city',
            state: '$_id.state',
          },
        },
        { $sort: { zipCode: 1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      result = await allZipCode.aggregate(similarPipeline);
    }
  }

  res.status(200).json({
    data: result,
    notFound,
  });
} catch (err) {
  console.error('Error in filterZipCodeForApp:', err);
  next(err);
}

},


// getStateCityAndZipCodesss: async (req, res, next) => {
//   try {
//     const cacheKey = 'uniqueStateCityZipRecords';

//     const cachedData = cache.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json(cachedData);
//     }

//     const promises = [
//       nursingHome.find().lean().select('state city zipCode -_id'),
//       hospital.find().lean().select('state city zipCode -_id'),
//       dialysisFacilityData.find().lean().select('state city zipCode -_id'),
//       homeHealthData.find().lean().select('state city zipCode -_id'),
//       hoSpiceData.find().lean().select('state city zipCode -_id'),
//       inpatientRehabilitiation.find().lean().select('state city zipCode -_id'),
//       memoryCare.find().lean().select('state city zipCode -_id'),
//       inHomeCare.find().lean().select('state city zipCode -_id'),
//     ];

//     const allData = (await Promise.all(promises)).flat();

//     const uniqueSet = new Set();
//     const uniqueStateCityZipList = [];

//     for (const item of allData) {
//       const state = item.state?.trim();
//       const city = item.city?.trim();
//       const zipCode = item.zipCode?.toString().trim();

//       if (!state || !city || !zipCode) continue;

//       const cityFormatted = capitalizeFirstLetter(city);
//       const uniqueKey = `${state.toLowerCase()}::${cityFormatted.toLowerCase()}::${zipCode}`;

//       if (!uniqueSet.has(uniqueKey)) {
//         uniqueSet.add(uniqueKey);
//         uniqueStateCityZipList.push({
//           state,
//           city: cityFormatted,
//           zipCode,
//         });
//       }
//     }

//     // Optional sorting
//     uniqueStateCityZipList.sort((a, b) => {
//       if (a.state === b.state) {
//         if (a.city === b.city) {
//           return a.zipCode.localeCompare(b.zipCode);
//         }
//         return a.city.localeCompare(b.city);
//       }
//       return a.state.localeCompare(b.state);
//     });

//     cache.set(cacheKey, uniqueStateCityZipList);
//     return res.status(200).json(uniqueStateCityZipList);
//   } catch (error) {
//     next(error);
//   }
// },


  
  // filterZipCodeForApp: async (req, res, next) => {
  //   try {
  //     const { zipCode, page } = req.query;
  //     // console.log(zipCode,"zipCode")
  //     let notFound=false;
  //     const regex = new RegExp(zipCode, 'i');
    
  //     const pipeline = [
  //       {
  //         $match: { zipCode: { $regex: regex } }
  //       },
  //       {
  //         $group: {
  //           _id: {
  //             zipCode: { $toLower: '$zipCode' },
  //             city: { $toLower: '$city' },
  //             state: { $toLower: "$state" }
  //           }
  //         }
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           zipCode: '$_id.zipCode',
  //           city: '$_id.city',
  //           state: '$_id.state'
  //         }
  //       },
  //       {
  //         $sort: { zipCode: 1 }
  //       },
  //       {
  //         $skip: (parseInt(page) - 1) * parseInt(2)
  //       },
  //       {
  //         $limit: parseInt(2)
  //       }
  //     ];
  
  //     const nursingHomeData = await nursingHome.aggregate(pipeline);

  //     // const skilledNursingHomeData = await skilledNursingHome.aggregate(pipeline);
  //     const inpatientRehabilitationData = await inpatientRehabilitiation.aggregate(pipeline);
  //     const inHomeCareData = await inHomeCare.aggregate(pipeline);
  //     const memoryCareData=await memoryCare.aggregate(pipeline)
  //     const homeHealthDataData=await homeHealthData.aggregate(pipeline)
  //     const hoSpiceDataData=await hoSpiceData.aggregate(pipeline)
  //     const hospitalData=await hospital.aggregate(pipeline)
  //     const dialysisFacilityDataData=await dialysisFacilityData.aggregate(pipeline)

  //     // const medicalFacilitiesData=await medicalFacilities.aggregate(pipeline)
  //     // const medicalSuppliersData=await medicalSuppliers.aggregate(pipeline)
  //     // const physicianData=await physicians.aggregate(pipeline)
  //     const mergedData = [...nursingHomeData, ...inpatientRehabilitationData,...memoryCareData ,...inHomeCareData,
  //       ...homeHealthDataData,...hoSpiceDataData,...hospitalData,...dialysisFacilityDataData
  //     ];
    

  //     const removeDuplicates = (data) => {
  //       const uniqueRecords = [];
      
  //       data.forEach((record) => {
  //         if (!uniqueRecords.some((r) => r.zipCode === record.zipCode && r.city === record.city && r.state===record.state)) {
  //           uniqueRecords.push(record);
  //         }
  //       });
      
  //       return uniqueRecords;
  //     };
      
  //     let result = removeDuplicates(mergedData);
  //     // Check if no exact match found and try to find closest zip codes
  //     if (result.length === 0) {
  //       notFound=true
  //       // Find zip codes with similar prefix
  //       const similarPipeline = [
  //         {
  //           $match: { zipCode: { $regex: new RegExp("^" + zipCode.substring(0, 3), 'i') } }
  //         },
  //         {
  //           $group: {
  //             _id: {
  //               zipCode: { $toLower: '$zipCode' },
  //               city: { $toLower: '$city' },
  //               state: { $toLower: "$state" }
  //             }
  //           }
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             zipCode: '$_id.zipCode',
  //             city: '$_id.city',
  //             state: '$_id.state'
  //           }
  //         },
  //         {
  //           $sort: { zipCode: 1 }
  //         },
  //         {
  //           $skip: (parseInt(page) - 1) * parseInt(2)
  //         },
  //         {
  //           $limit: parseInt(5)
  //         }
  //       ];
  //       const nursingHomeData = await nursingHome.aggregate(similarPipeline);
  //     // const skilledNursingHomeData = await skilledNursingHome.aggregate(similarPipeline);
  //     const inpatientRehabilitationData = await inpatientRehabilitiation.aggregate(similarPipeline);
  //     const inHomeCareData = await inHomeCare.aggregate(similarPipeline);
  //     const memoryCareData=await memoryCare.aggregate(similarPipeline)
  //     const mergedData = [...nursingHomeData, ...inpatientRehabilitationData,...memoryCareData ,...inHomeCareData];
    

  //     const removeDuplicates = (data) => {
  //       const uniqueRecords = [];
      
  //       data.forEach((record) => {
  //         if (!uniqueRecords.some((r) => r.zipCode === record.zipCode && r.city === record.city && r.state===record.state)) {
  //           uniqueRecords.push(record);
  //         }
  //       });
      
  //       return uniqueRecords;
  //     };
      
  //     result = removeDuplicates(mergedData);
  //     }
      
  //     res.status(200).json({
  //       data:result,
  //       notFound:notFound
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // },
  
 filterZipCodeForApp: async (req, res, next) => {
  try {
    const { zipCode, page } = req.query;
    console.log(req.query);
    let notFound = false;

    const pipeline = [];

    // ✅ Match searchQuery against zipCode, state, or city
    if (zipCode) {
      const regex = new RegExp(zipCode, "i");
      pipeline.push({
        $match: {
          $or: [
            { zipCode: { $regex: regex } },
            { state: { $regex: regex } },
            { city: { $regex: regex } },
          ],
        },
      });
    }

    // ✅ Group by zipCode, city, and state, collect facility names
    pipeline.push({
      $group: {
        _id: {
          zipCode: { $toLower: "$zipCode" },
          city: { $toLower: "$city" },
          state: { $toLower: "$state" },
        },
        names: { $addToSet: "$name" },
      },
    });

    // ✅ Project the required fields
    pipeline.push({
      $project: {
        _id: 0,
        zipCode: "$_id.zipCode",
        city: "$_id.city",
        state: "$_id.state",
        names: 1, // include facility names
      },
    });

    // ✅ Sort and paginate
    pipeline.push({ $sort: { zipCode: 1 } });

    const limit = 5;
    pipeline.push(
      { $skip: (parseInt(page) - 1) * limit },
      { $limit: limit }
    );

    // ✅ Aggregate data from all collections
    const nursingHomeData = await nursingHome.aggregate(pipeline);
    const inpatientRehabilitationData = await inpatientRehabilitiation.aggregate(pipeline);
    const inHomeCareData = await inHomeCare.aggregate(pipeline);
    const memoryCareData = await memoryCare.aggregate(pipeline);

    const mergedData = [
      ...nursingHomeData,
      ...inpatientRehabilitationData,
      ...memoryCareData,
      ...inHomeCareData,
    ];

    // ✅ Remove duplicates
    const removeDuplicates = (data) => {
      const uniqueRecords = [];
      data.forEach((record) => {
        if (
          !uniqueRecords.some(
            (r) =>
              r.zipCode === record.zipCode &&
              r.city === record.city &&
              r.state === record.state
          )
        ) {
          uniqueRecords.push(record);
        }
      });
      return uniqueRecords;
    };

    let result = removeDuplicates(mergedData);

    // ✅ Handle no exact matches → try partial matches
    if (result.length === 0) {
      notFound = true;

      if (zipCode) {
        const similarPipeline = [
          {
            $match: {
              zipCode: { $regex: new RegExp("^" + zipCode.substring(0, 3), "i") },
            },
          },
          {
            $group: {
              _id: {
                zipCode: { $toLower: "$zipCode" },
                city: { $toLower: "$city" },
                state: { $toLower: "$state" },
              },
              names: { $addToSet: "$name" },
            },
          },
          {
            $project: {
              _id: 0,
              zipCode: "$_id.zipCode",
              city: "$_id.city",
              state: "$_id.state",
              names: 1,
            },
          },
          { $sort: { zipCode: 1 } },
          { $skip: (parseInt(page) - 1) * limit },
          { $limit: limit },
        ];

        const similarNursingHomeData = await nursingHome.aggregate(similarPipeline);
        const similarInpatientRehabilitationData = await inpatientRehabilitiation.aggregate(similarPipeline);
        const similarInHomeCareData = await inHomeCare.aggregate(similarPipeline);
        const similarMemoryCareData = await memoryCare.aggregate(similarPipeline);

        const similarMergedData = [
          ...similarNursingHomeData,
          ...similarInpatientRehabilitationData,
          ...similarInHomeCareData,
          ...similarMemoryCareData,
        ];

        result = removeDuplicates(similarMergedData);
      }
    }

    res.status(200).json({
      data: result,
      notFound,
    });
  } catch (err) {
    next(err);
  }
},

// all Unique center Name
getAllUniqueCenterNamesByZipCode: async (req, res, next) => {
  try {
      const { zipCode } = req.query;

      // Key for caching (e.g. "noZip" for empty query)
      const cacheKey = zipCode && zipCode.trim() !== '' ? `zip_${zipCode}` : 'noZip';

      // ✅ Return from cache if available and no zipCode
      if (cacheKey === 'noZip') {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          console.log("✅ Returning data from cac");
          return res.status(200).json({ data: cachedData });
        }
      }

      const collections = {
        'Nursing Home': nursingHome,
        'In Home Care': inHomeCare,
        'Memory Care': memoryCare,
        // 'Hospice': hoSpiceData,
        // 'Hospital': hospital,
        // 'Dialysis Facility': dialysisFacilityData,
        // 'Home Health': homeHealthData,
        'Inpatient Rehabilitation': inpatientRehabilitiation,
      };

      // Helper function to fetch names from a collection
      const fetchNames = async (model) => {
        const query = {};
        if (zipCode && zipCode.trim() !== '') query.zipCode = zipCode;
        const data = await model.find(query, { name: 1, _id: 0 }).lean();
        return data.map((item) => item.name);
      };

      // Fetch all names from all collections
      const resultsArray = await Promise.all(
        Object.keys(collections).map((key) => fetchNames(collections[key]))
      );

      // Flatten and get unique names
      const allNames = [...new Set(resultsArray.flat())];

      // ✅ Store in cache if no zipCode
      if (cacheKey === 'noZip') {
        cache.set(cacheKey, allNames);
        console.log("🗄️ Data cached for noZip");
      }

      res.status(200).json({ data: allNames });
    } catch (err) {
      console.error("Error in getAllUniqueCenterNames:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },




  

   filterZipCodeForWeb: async (req, res, next) => {
    try {
        const { zipCode, page, limit } = req.params;
        const regex = new RegExp(zipCode, 'i');
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        const createPipeline = (zipRegex) => [
            { $match: { zipCode: { $regex: zipRegex } } },
            { $sort: { zipCode: 1 } },
            { $skip: skip },
            { $limit: parsedLimit }
        ];

        const aggregateData = async (pipeline) => {
            const [nursingHomeData, inpatientRehabilitationData, inHomeCareData, memoryCareData,hoSpiceDataData,hospitalData,dialysisFacilityDataData,homeHealthDataData] = await Promise.all([
                nursingHome.aggregate(pipeline),
                inpatientRehabilitiation.aggregate(pipeline),
                inHomeCare.aggregate(pipeline),
                memoryCare.aggregate(pipeline),
                hoSpiceData.aggregate(pipeline),
                hospital.aggregate(pipeline),
                dialysisFacilityData.aggregate(pipeline),
                homeHealthData.aggregate(pipeline),
            ]);
            return [...nursingHomeData, ...inpatientRehabilitationData, ...inHomeCareData, ...memoryCareData, ...hoSpiceDataData, ...hospitalData, ...dialysisFacilityDataData, ...homeHealthDataData];
        };

        const removeDuplicates = (data) => {
            const uniqueRecords = new Map();
            data.forEach(record => {
                const key = `${record.zipCode}-${record.city}-${record.state}`;
                if (!uniqueRecords.has(key)) uniqueRecords.set(key, record);
            });
            return Array.from(uniqueRecords.values());
        };

        let mergedData = await aggregateData(createPipeline(regex));
        let notFound = mergedData.length === 0;

        if (notFound) {
            const similarZipRegex = new RegExp(`^${zipCode.substring(0, 3)}`, 'i');
            const similarPipeline = [
                { $match: { zipCode: { $regex: similarZipRegex } } },
                {
                    $group: {
                        _id: {
                            zipCode: { $toLower: '$zipCode' },
                            city: { $toLower: '$city' },
                            state: { $toLower: '$state' }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        zipCode: '$_id.zipCode',
                        city: '$_id.city',
                        state: '$_id.state'
                    }
                },
                { $sort: { zipCode: 1 } },
                { $skip: skip },
                { $limit: parsedLimit }
            ];

            mergedData = await aggregateData(similarPipeline);
        }

        const uniqueZipCodes = Array.from(new Set(mergedData.map(record => record.zipCode)));

        res.status(200).json({
            data: uniqueZipCodes,
            notFound: notFound
        });
    } catch (err) {
        next(err);
    }
}
,


 
  
filterZipCodeNewAppForApp : async (req, res) => {
 try {
  const { zipCode , page = 1 } = req.query;
  const limit = 10;
  const skip = (parseInt(page) - 1) * limit;
  let notFound = false;

  const pipeline = [];

  // Match search query against zipCode, city, or state
  if (zipCode) {
    const regex = new RegExp(zipCode, 'i'); // <-- Fix: use zipCode here
    pipeline.push({
      $match: {
        $or: [
          { zipCode: { $regex: regex } },
          { state: { $regex: regex } },
          { city: { $regex: regex } },
        ],
      },
    });
  }

  // Group by zipCode + city + state to avoid duplicates
  pipeline.push({
    $group: {
      _id: {
        zipCode: { $toLower: '$zipCode' },
        city: { $toLower: '$city' },
        state: { $toLower: '$state' },
      },
    },
  });

  // Project required fields
  pipeline.push({
    $project: {
      _id: 0,
      zipCode: '$_id.zipCode',
      city: '$_id.city',
      state: '$_id.state',
    },
  });

  // Sort by zipCode
  pipeline.push({ $sort: { zipCode: 1 } });

  // Pagination
  pipeline.push({ $skip: skip }, { $limit: limit });

  // Query from allZipCodeUs collection
  let result = await allZipCode.aggregate(pipeline);

  if (result.length === 0) {
    notFound = true;

    // Try partial match using first 3 chars of zipCode if it's a full 5-digit zip
    if (/^\d{5}$/.test(zipCode)) {
      const similarPipeline = [
        {
          $match: {
            zipCode: { $regex: new RegExp('^' + zipCode.substring(0, 3), 'i') },
          },
        },
        {
          $group: {
            _id: {
              zipCode: { $toLower: '$zipCode' },
              city: { $toLower: '$city' },
              state: { $toLower: '$state' },
            },
          },
        },
        {
          $project: {
            _id: 0,
            zipCode: '$_id.zipCode',
            city: '$_id.city',
            state: '$_id.state',
          },
        },
        { $sort: { zipCode: 1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      result = await allZipCode.aggregate(similarPipeline);
    }
  }

  res.status(200).json({
    data: result,
    notFound,
  });
}
catch (err) {
  console.error('Error in filterZipCodeForApp:', err);
  next(err);
}

},


// search By center name


searchCenterByName: async (req, res, next) => {

  try {
    const { search = '', categoryNames = [], zipCode = '', page, limit = 9 } = req.query;
    const regex = new RegExp(search, 'i');
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const collections = {
      'Nursing Home': nursingHome,
      'Inpatient Rehabilitation': inpatientRehabilitiation,
      'In Home Care': inHomeCare,
      'Memory Care': memoryCare,
      // 'Hospice': hoSpiceData,
      // 'Hospital': hospital,
      // 'Dialysis Facility': dialysisFacilityData,
      // 'Home Health': homeHealthData,
    };

    // ✅ Helper: search model with optional zip filter
    const searchModel = async (model) => {
      const query = {
        name: { $regex: regex },
      };

      // ✅ Apply zip filter if zipCode is provided
      if (zipCode && zipCode.trim() !== '') {
        query.zipCode = zipCode; // 👈 Make sure your schema field is `zip` or change it accordingly (zipCode / postalCode)
      }

      console.log(query,"query" )

      return await model
        .find(query, { name: 1,  _id: 0 })
        .skip(skip)
        .limit(parsedLimit)
        .lean();
    };

    // ✅ Determine which categories to search
    let selectedCategories = Array.isArray(categoryNames)
      ? categoryNames.filter((cat) => collections[cat])
      : Object.keys(collections);

    // ✅ Execute search for all relevant collections
    const resultsArray = await Promise.all(
      selectedCategories.map((cat) => searchModel(collections[cat]))
    );

    const results = resultsArray.flat();

    res.status(200).json({
      data: results,
      notFound: results.length === 0,
    });

  } catch (err) {
    console.error('Error in searchCenterByName:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},





  getProfessionalsUsingZipCode: async (req, res, next) => {
    try {
      const { zipCode } = req.params;
      const regex = new RegExp(
        `(^\\d{5}-${zipCode}$|^${zipCode}-\\d{4}$)`,
        'i'
      );
      if (zipCode) {
        const allData = await Professional.find({
          'locations.zip_code': regex,
        });
        res.status(200).json(allData);
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

  // testApi:async(req,res,next)=>{
  //   try {
  //     const promises = [
  //       nursingHome
  //         .find({})
  //         .lean()
  //         .select('_id name latitude longitude mainCategory city state zipCode'),
  //       skilledNursingHome
  //         .find()
  //         .lean()
  //         .select('_id name latitude longitude mainCategory city state zipCode'),
  //     ];

  //     const records = await Promise.all(promises);
  //   const data=  [].concat(...records);
  //     // console.log(data,"data")

  //     const nursingHomeCities = records[0].map((home) => home.city);
  //     // console.log(nursingHomeCities)
  //     const skilledNursingHomeCities = records[1].map((home) => home.city);

  //     console.log(skilledNursingHomeCities)
  //     // Find common cities
  //     const commonCities = nursingHomeCities.filter((city) =>
  //       skilledNursingHomeCities.includes(city)
  //     );
  //     console.log(commonCities)


  //     res.status(200).json(commonCities);
  //   } catch (err) {
  //     next(err);
  //   }


  // },

  //for get all Corporates
  
  getCorporatesUsingMongoId: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.body;

      switch (category) {
        case 'hospital':
          const hospitalData = await hospital
            .findOne({ _id: mongoDbID })
            .lean();

          res.status(200).json(hospitalData);
          break;

        case 'Provider':
          const providerDatas = await providerData.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(providerDatas);

        case 'inpatientRehabilitiation':
          const rehabData = await inpatientRehabilitiation.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(rehabData);
          break;

        case 'nursingHome':
          const nursingHomeData = await nursingHome
            .findOne({ _id: mongoDbID })
            .lean();
          res.status(200).json(nursingHomeData);
          break;

        case 'longTermCares':
          const longTermCaresData = await longTermCares
            .findOne({
              _id: mongoDbID,
            })
            .lean();
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
          const independentLiv = await independentLiving.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(independentLiv);
          break;

        case 'Memory Care':
          const memory = await memoryCare.findOne({ _id: mongoDbID });
          res.status(200).json(memory);
          break;

        case 'In Home Care':
          const inhomecare = await inHomeCare.findOne({ _id: mongoDbID });
          res.status(200).json(inhomecare);
          break;

        case 'Assisted Living':
          const assLiv = await assistedLiving.findOne({ _id: mongoDbID });
          res.status(200).json(assLiv);
          break;

        case 'Adult Day Care':
          const adultDay = await adultDayCare.findOne({ _id: mongoDbID });
          res.status(200).json(adultDay);
          break;

        case 'Care Retirement Communities':
          const careRetirementcommunity = await careRetirement.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(careRetirementcommunity);
          break;

        case 'Skilled Nursing Facility':
          const skilledNursingFacility = await skilledNursingHome.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(skilledNursingFacility);
          break;

        case 'Geriatic Care Manager':
          const geriaticCare = await geriaticCareManager.findOne({
            _id: mongoDbID,
          });
          res.status(200).json(geriaticCare);
          break;
          // case 'medicalFacilities':
          // const MedicareFacility = await medicalFacilities.findOne({
          //   _id: mongoDbID,
          // });
          // res.status(200).json(MedicareFacility);
          // break;
          // case 'medicareSupplier':
          // const MedicareSupplier = await medicalSuppliers.findOne({
          //   _id: mongoDbID,
          // });
          // res.status(200).json(MedicareSupplier);
          // break;
          // case 'physician':
          // const physiciansSupplier = await physicians.findOne({
          //   _id: mongoDbID,
          // });
          // res.status(200).json(physiciansSupplier);
          // break;

        default:
          res.status(400).json({ message: 'Invalid category' });
          break;
      }
    } catch (error) {
      console.log(error,"errrrrr")
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
      }
       else {
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
        memoryCare.countDocuments().lean(),
        inHomeCare.countDocuments().lean(),
        assistedLiving.countDocuments().lean(),
        adultDayCare.countDocuments().lean(),
        careRetirement.countDocuments().lean(),
        skilledNursingHome.countDocuments().lean(),
        geriaticCareManager.countDocuments().lean(),
        physicians.countDocuments().lean(),
        medicalFacilities.countDocuments().lean(),
        medicalSuppliers.countDocuments().lean(),

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
        independentLivingCount,
        memoryCareCount,
        inHomeCareCount,
        assistedLivingCount,
        adultDayCareCount,
        careRetirementCount,
        skilledNursingFacilityCount,
        geriaticCareManagerCount,
        physiciansCount,
        medicalFacilitiesCount,
        medicalSuppliersCount,
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
          independentLiving: independentLivingCount,
          memoryCare: memoryCareCount,
          inHomeCare: inHomeCareCount,
          assistedLiving: assistedLivingCount,
          adultDayCare: adultDayCareCount,
          careRetirement: careRetirementCount,
          skilledNursingFacility: skilledNursingFacilityCount,
          geriaticCareManager: geriaticCareManagerCount,
          physicians: physiciansCount,
          medicalFacilities: medicalFacilitiesCount,
          medicalSuppliers: medicalSuppliersCount,

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
        independentLiving: independentLivingCount,
        memoryCare: memoryCareCount,
        inHomeCare: inHomeCareCount,
        assistedLiving: assistedLivingCount,
        adultDayCare: adultDayCareCount,
        careRetirement: careRetirementCount,
        skilledNursingFacility: skilledNursingFacilityCount,
        geriaticCareManager: geriaticCareManagerCount,
        physicians: physiciansCount,
        medicalFacilities: medicalFacilitiesCount,
        medicalSuppliers: medicalSuppliersCount,
      });
    } catch (error) {
      next(error);
    }
  },
  // //get records on the basis of categories
  // getRecordsUsingCat: async (req, res, next) => {
  //   try {
  //     const { cat } = req.params;
  //     const cachedData = cache.get(cat);

  //     if (cachedData) {
  //       return res.status(200).json(cachedData);
  //     }

  //     let data;

  //     switch (cat) {
  //       case 'dialysisFacilityData':
  //         data = await dialysisFacilityData
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');
  //         break;
  //       case 'hospital':
  //         data = await hospital
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'longTermCares':
  //         data = await longTermCares
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'nursingHome':
  //         data = await nursingHome
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'inpatientRehabilitiation':
  //         data = await inpatientRehabilitiation
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'hoSpiceData':
  //         data = await hoSpiceData
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'groupPracticeData':
  //         data = await groupPracticeData
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'homeHealthData':
  //         data = await homeHealthData
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'professional':
  //         data = await Professional.find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Independent Living':
  //         data = await independentLiving
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Memory Care':
  //         data = await memoryCare
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'In Home Care':
  //         data = await inHomeCare
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Assisted Living':
  //         data = await inHomeCare
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Adult Day Care':
  //         data = await adultDayCare
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Care Retirement Communities':
  //         data = await careRetirement
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Skilled Nursing Facility':
  //         data = await skilledNursingHome
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
  //       case 'Geriatic Care Manager':
  //         data = await geriaticCareManager
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;
        
  //       case 'medicalFacilities':
  //         data = await medicalFacilities
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;

  //       case 'medicalSuppliers':
  //         data = await medicalSuppliers
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');

  //         break;

  //       case 'physician':
  //         data = await physicians
  //           .find()
  //           .lean()
  //           .select('name fullAddress state city zipCode phoneNumber');
  //         break;
  //       default:
  //         data = 'Invalid Category';
  //         break;
  //     }

  //     // Cache the data for future requests
  //     cache.set(cat, data);

  //     return res.status(200).json(data);
  //   } catch (error) {
  //     next(error);
  //   }
  // },


  getRecordsUsingCat: async (req, res, next) => {
    try {
      const { cat,page } = req.params;
      // const page = parseInt(req.query.page) || 1;
      const limit =  10;
      const skip = (page - 1) * limit;
  
      let model;
      switch (cat) {
        case 'dialysisFacilityData':
          model = dialysisFacilityData;
          break;
        case 'hospital':
          model = hospital;
          break;
        case 'longTermCares':
          model = longTermCares;
          break;
        case 'nursingHome':
          model = nursingHome;
          break;
        case 'inpatientRehabilitiation':
          model = inpatientRehabilitiation;
          break;
        case 'hoSpiceData':
          model = hoSpiceData;
          break;
        case 'groupPracticeData':
          model = groupPracticeData;
          break;
        case 'homeHealthData':
          model = homeHealthData;
          break;
        case 'professional':
          model = Professional;
          break;
        case 'Independent Living':
          model = independentLiving;
          break;
        case 'Memory Care':
          model = memoryCare;
          break;
        case 'In Home Care':
        case 'Assisted Living':
          model = inHomeCare;
          break;
        case 'Adult Day Care':
          model = adultDayCare;
          break;
        case 'Care Retirement Communities':
          model = careRetirement;
          break;
        case 'Skilled Nursing Facility':
          model = skilledNursingHome;
          break;
        case 'Geriatic Care Manager':
          model = geriaticCareManager;
          break;
        case 'medicalFacilities':
          model = medicalFacilities;
          break;
        case 'medicalSuppliers':
          model = medicalSuppliers;
          break;
        case 'physician':
          model = physicians;
          break;
        default:
          return res.status(400).json({ message: 'Invalid Category' });
      }
  
      const [data, total] = await Promise.all([
        model.aggregate([
          {
            $addFields: {
              nameStartsWithLetter: {
                $cond: [
                  { $regexMatch: { input: "$name", regex: /^[A-Za-z]/ } },
                  1,
                  0
                ]
              }
            }
          },
          {
            $sort: {
              nameStartsWithLetter: -1, // 1s (A-Z) come first
              name: 1                   // then sort A-Z within group
            }
          },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              fullAddress: 1,
              state: 1,
              city: 1,
              zipCode: 1,
              phoneNumber: 1
            }
          }
        ]),
        model.countDocuments()
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      return res.status(200).json({
        data,
        currentPage: page,
        totalPages,
        totalRecords: total
      });
    } catch (error) {
      next(error);
    }
  },
  
  
  fetchNewNursingHomeRecords: async (req, res, next) => {
    try {
      const nursingHomeRecords = await nursingHomeNew.find();
      res.status(200).json(nursingHomeRecords);
    } catch (error) {
      next(error);
    }
  },
// getMultiple Categories and Count
  getMultipleCategories: async (req, res, next) => {
    const { state, city, zipCode,overall_rating, name, page, limit ,search} = req.body;
    // console.log(req.body)
    // console.log(state, city, zipCode,overall_rating, name, page, limit ,search,"search");
    try {

      if (typeof name === 'object') {
        const scrapeCategory = async (categoryName) => {
          let query = {};
          console.log(query)
      
          if (state) {
            query.state = state;
          }
                          
          if (city) {
            query.city = city;
          }
      
          if (zipCode) {
            query.zipCode = zipCode;
          }
          if (overall_rating) {
            const overallRatings = overall_rating.map(Number);
            query.overall_rating = { $in: overallRatings };
        }
        

        if (search) {
          const searchQuery = {
              $or: [
                  { name: { $regex: new RegExp(search, 'i') } },
                  // { zipCode: { $regex: new RegExp(search, 'i') } },
                  // { state: { $regex: new RegExp(search, 'i') } },
                  // { city: { $regex: new RegExp(search, 'i') } },
                  // { mainCategory: { $regex: new RegExp(search, 'i') } },
              ]
          };
          Object.assign(query, searchQuery);
      }
      
          let result = [];
          let totalCount = 0;
      
           if (categoryName === 'Nursing Home') {
            totalCount = await nursingHome.countDocuments(query);
            result = await nursingHome
              .find(query)
              .select('_id name city state mainCategory fullAddress phoneNumber zipCode images overall_rating longitude latitude')
              .lean()
              .skip(page * limit)
              .limit(limit);
          } 
           else if (categoryName === 'Inpatient Rehabilitiation') {
            totalCount = await inpatientRehabilitiation.countDocuments(query);
            result = await inpatientRehabilitiation
              .find(query)
              .select('_id name city state mainCategory fullAddress phoneNumber zipCode longitude latitude')
              .lean()
              .skip(page * limit)
              .limit(limit);
          } else if (categoryName === 'In Home Care') {
            totalCount = await inHomeCare.countDocuments(query);
            result = await inHomeCare
              .find(query)
              .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
              .lean()
              .skip(page * limit)
              .limit(limit);
          }
          else if (categoryName === 'Memory Care') {
            totalCount = await memoryCare.countDocuments(query);
                      result = await memoryCare
                      .find(query)
                      .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
                      .lean()
                      .skip(page * limit)
                      .limit(limit);
          }
          else if (categoryName === 'HoSpice') {
            totalCount = await hoSpiceData.countDocuments(query);
                      result = await hoSpiceData
                      .find(query)
                      .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
                      .lean()
                      .skip(page * limit)
                      .limit(limit);
          }
          else if (categoryName === 'Home Health') {
            totalCount = await homeHealthData.countDocuments(query);
                      result = await homeHealthData
                      .find(query)
                      .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
                      .lean()
                      .skip(page * limit)
                      .limit(limit);
          }
          else if (categoryName === 'Dialysis Facility') {
            totalCount = await dialysisFacilityData.countDocuments(query);
                      result = await dialysisFacilityData
                      .find(query)
                      .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
                      .lean()
                      .skip(page * limit)
                      .limit(limit);
          }
          else if (categoryName === 'Hospital') {
            totalCount = await hospital.countDocuments(query);
                      result = await hospital
                      .find(query)
                      .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude')
                      .lean()
                      .skip(page * limit)
                      .limit(limit);
          }
         
          // else if (categoryName === 'Physician') {
          //   totalCount = await physicians.countDocuments(query);
          //             result = await physicians
          //             .find(query)
          //             .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos')
          //             .lean()
          //             .skip(page * limit)
          //             .limit(limit);
          // }
          // else if (categoryName === 'Medical Facilities') {
          //   totalCount = await medicalFacilities.countDocuments(query);
          //             result = await medicalFacilities
          //             .find(query)
          //             .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos')
          //             .lean()
          //             .skip(page * limit)
          //             .limit(limit);
          // }
          // else if (categoryName === 'Medical Suppliers') {
          //   totalCount = await medicalSuppliers.countDocuments(query);
          //             result = await medicalSuppliers
          //             .find(query)
          //             .select('_id name city state mainCategory fullAddress phoneNumber zipCode photos')
          //             .lean()
          //             .skip(page * limit)
          //             .limit(limit);
          // }
          return { result, totalCount };
        };
      
        const scrapeAllCategories = async (categories) => {
          const promises = categories.map((categoryName) => scrapeCategory(categoryName));
          const results = await Promise.all(promises);
          return results;
        };
      
        try {
          const scrapedData = await scrapeAllCategories(name);
      
          const totalCount = scrapedData.reduce((acc, curr) => acc + curr.totalCount, 0);
          const flatResults = scrapedData.flatMap((data) => data.result);
      
          res.status(200).json({ totalCount, data: flatResults });        

        } catch (err) {
          next(err);
        }
      }
     
    } catch (error) {
      next(error);
    }
  },

  // addLocation:async (req,res,next)=>{

  //   try{
  //     const records = await dialysisFacilityData.find();

  //     // Update each record with the location field
  //     const updates = records.map((record) => {
  //       if (record.latitude && record.longitude) {
  //         return dialysisFacilityData.updateOne(
  //           { _id: record._id },
  //           {
  //             $set: {
  //               location: {
  //                 type: 'Point',
  //                 coordinates: [parseFloat(record.longitude), parseFloat(record.latitude)],
  //               },
  //             },
  //           }
  //         );
  //       }
  //       return Promise.resolve(); // Skip records without latitude and longitude
  //     });
  
  //     // Execute all updates
  //     await Promise.all(updates);
  //     return res.status(200).json('Location fields updated successfully');
  
  //   } catch (error) {

  //     next(error);

  //   }

  // },
  getMultipleCategoriesApp: async (req, res, next) => { 
    const { state, city, zipCode, categoryNames, page, limit, search, overall_rating,longitude, latitude,ascending,descending } = req.query;
   
    console.log(req.query)

    const {isAdmin,_id}=req.user
    if(isAdmin==="patient"){
      // console.log(_id,"id")
        try {
          const query = {};
          if (state) query.state = state;
          if (city) query.city = city;
          if (zipCode) query.zipCode = zipCode;
          if (search) {
              const searchQuery = {
                  $or: [
                      { name: { $regex: new RegExp(search, 'i') } },
                      // { zipCode: { $regex: new RegExp(search, 'i') } },
                      { state: { $regex: new RegExp(search, 'i') } },
                      { city: { $regex: new RegExp(search, 'i') } },
                      // { mainCategory: { $regex: new RegExp(search, 'i') } },
                  ]
              };
              Object.assign(query, searchQuery);
          }
          if (overall_rating) {
              const overallRatings = overall_rating.map(Number);
              query.overall_rating = { $in: overallRatings };
          }
          let aggregationPipeline = [];
          if (longitude && latitude) {
            // If longitude and latitude are provided, add $geoNear stage to sort by distance
            aggregationPipeline.push({
              $geoNear: {
                near: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                distanceField: 'distance',
                spherical: true,
              },
            });
          }
              const getResultsAndCount = async (model) => {
          const count = await model.countDocuments(query);
          const pipeline = [...aggregationPipeline]; // Copy the pipeline to avoid modification across iterations
          if (ascending === 'true') {
            pipeline.push({ $sort: { name: 1 } }); // Sort in ascending order by name (you can change 'name' to the field you want to sort by)
          } else if (descending === 'true') {
            pipeline.push({ $sort: { name: -1 } }); // Sort in descending order by name (you can change 'name' to the field you want to sort by)
          }
          pipeline.push(
            {
              $match: query,
            },
            {
              $project: {
                _id: 1,
                name: 1,
                city: 1,
                state: 1,
                mainCategory: 1,
                fullAddress: 1,
                phoneNumber: 1,
                zipCode: 1,
                overall_rating: 1,
                latitude: 1,
                longitude: 1,
              },
            },
            {
              $skip: page * parseInt(limit),
            },
            {
              $limit: parseInt(limit),
            }
          );
          const data = await model.aggregate(pipeline).allowDiskUse(true).exec();
          return { count, data };
        };
    
        let totalCount = 0;
        let result = [];
    
        if (categoryNames && categoryNames.length > 0) {
          const promises = categoryNames.map((categoryName) => {
            const categoryModel = getCategoryModel(categoryName);
            return getResultsAndCount(categoryModel).then(({ count, data }) => {
              totalCount += count;
              result = result.concat(data);
            });
          });
    
          await Promise.all(promises);
        } else {
          // If no categories are provided, fetch data for all categories
          const allCategories = ['Nursing Home','Inpatient Rehabilitiation','In Home Care','Memory Care',];
          const promises = allCategories.map((category) => getResultsAndCount(getCategoryModel(category)));
          const categoryResults = await Promise.all(promises);
    
          totalCount = categoryResults.reduce((acc, curr) => acc + curr.count, 0);
          result = categoryResults.flatMap((data) => data.data);
        }

          // Update to include favorite field
          const getFavourateWithResponse = await axios.get(process.env.favApiUrl, {});
          const responseData = getFavourateWithResponse.data;
          // console.log(responseData,"data")
        

          const matchDataById = responseData.filter((item) => {
            return item.patId === _id; // Keep only items where patId matches _id
        });
        
        result.forEach((item) => {
            const isFavorite = matchDataById.some((fav) => {
                // console.log(fav, "favorite"); // Log inside the some() callback
                return fav.scrapeObjectId === item._id.toString();
            });
            item.favorite = isFavorite;
        });
      
      

          res.status(200).json({ totalCount, data: result });
      } catch (error) {
          next(error);
        
      }
    }
    else if(req.user==="notLogin"){
      try {
        const query = {};
        if (state) query.state = state;
        if (city) query.city = { $regex: new RegExp(city, 'i') };
        if (zipCode) query.zipCode = zipCode;
        if (search) {
            const searchQuery = {
                $or: [
                    { name: { $regex: new RegExp(search, 'i') } },
                    { zipCode: { $regex: new RegExp(search, 'i') } },
                    { state: { $regex: new RegExp(search, 'i') } },
                    { city: { $regex: new RegExp(search, 'i') } },
                    { mainCategory: { $regex: new RegExp(search, 'i') } },
                ]
            };
            Object.assign(query, searchQuery);
        }
        if (overall_rating) {
            const overallRatings = overall_rating.map(Number);
            query.overall_rating = { $in: overallRatings };
        }
        let aggregationPipeline = [];
        if (longitude && latitude) {
          // If longitude and latitude are provided, add $geoNear stage to sort by distance
          aggregationPipeline.push({
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
              },
              distanceField: 'distance',
              spherical: true,
            },
          });
        }
        // console.log(query, "query");
        const getResultsAndCount = async (model) => {
          const count = await model.countDocuments(query);
          const pipeline = [...aggregationPipeline]; // Copy the pipeline to avoid modification across iterations
          if (ascending === 'true') {
            pipeline.push({ $sort: { name: 1 } }); // Sort in ascending order by name (you can change 'name' to the field you want to sort by)
          } else if (descending === 'true') {
            pipeline.push({ $sort: { name: -1 } }); // Sort in descending order by name (you can change 'name' to the field you want to sort by)
          }
          pipeline.push(
            {
              $match: query,
            },
            {
              $project: {
                _id: 1,
                name: 1,
                city: 1,
                state: 1,
                mainCategory: 1,
                fullAddress: 1,
                phoneNumber: 1,
                zipCode: 1,
                overall_rating: 1,
                latitude: 1,
                longitude: 1,
              },
            },
            {
              $skip: page * parseInt(limit),
            },
            {
              $limit: parseInt(limit),
            }
          );
          const data = await model.aggregate(pipeline).allowDiskUse(true).exec();
          return { count, data };
        };
    
        let totalCount = 0;
        let result = [];
    
        if (categoryNames && categoryNames.length > 0) {
          const promises = categoryNames.map((categoryName) => {
            const categoryModel = getCategoryModel(categoryName);
            return getResultsAndCount(categoryModel).then(({ count, data }) => {
              totalCount += count;
              result = result.concat(data);
            });
          });
    
          await Promise.all(promises);
        } else {
          // If no categories are provided, fetch data for all categories
          console.log("all")
          const allCategories = ['Nursing Home','Inpatient Rehabilitiation','In Home Care','Memory Care',];
          const promises = allCategories.map((category) => getResultsAndCount(getCategoryModel(category)));
          const categoryResults = await Promise.all(promises);
    
          totalCount = categoryResults.reduce((acc, curr) => acc + curr.count, 0);
          result = categoryResults.flatMap((data) => data.data);
        }

        // Update to include favorite field
        const getFavourateWithResponse = await axios.get(process.env.favApiUrl, {});
        const responseData = getFavourateWithResponse.data;
        // console.log(responseData,"data")
       

        const matchDataById = responseData.filter((item) => {
          return item.patId === _id; // Keep only items where patId matches _id
      });
      
    
    
    

        res.status(200).json({ totalCount, data: result });
    } catch (error) {
      // console.log(error,"error")
        next(error);
        console.log(error,"error")
    }
    }
    
},



  getProfessionalEachSpecialityRecords: async (req, res, next) => {
    try {
      let data = await Professional.aggregate([
        {
          $unwind: '$specialities',
        },
        {
          $group: {
            _id: '$specialities',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  getRecordsUsingProfessionalSpeciality: async (req, res, next) => {
    try {
      const { speciality } = req.params;
      const getSpeciality = await Professional.find({
        specialities: { $in: speciality },
      });

      res.status(200).json(getSpeciality);
    } catch (error) {
      next(error);
    }
  },

  //new api for filteration
  getMultipleCategoryData: async (req, res, next) => {  
    try {

      const { name, pages, limit } = req.body;

      const scrapeCategory = async (categoryName) => {
        let result = [];
        if (categoryName === 'Nursing Home') {
          result = await nursingHome
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);
          ;
        } else if (categoryName === 'Long Term Cares') {
          result = await longTermCares
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean()
            .skip(pages * limit)
            .limit(limit);
        } else if (categoryName === 'Dialysis Facility') {
          result = await dialysisFacilityData
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean()
            .skip(pages * limit)
            .limit(limit);
        } else if (categoryName === 'Hospital') {
          result = await hospital
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean()
            .skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Hospice') {
          result = await hoSpiceData
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean()
            .skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Inpatient Rehabilitiation') {
          result = await inpatientRehabilitiation
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Group Practice') {
          result = await groupPracticeData
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Home Health') {
          result = await homeHealthData
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Independent Living') {
          result = await independentLiving
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Memory Care') {
          result = await memoryCare
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'In Home Care') {
          result = await inHomeCare
            .find()
            .select('name city state phoneNumber mainCategory zipCode')
            .lean().skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Assisted Living') {
          result = await assistedLiving
            .find()
            .lean()
            .select('name city state phoneNumber mainCategory zipCode')
            .skip(pages * limit)
            .limit(limit);;
        } else if (categoryName === 'Adult Day Care') {
          result = await adultDayCare
            .find()
            .lean()
            .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
            .limit(limit);
        } else if (categoryName === 'Care Retirement Communities') {
          result = await careRetirement
            .find()
            .lean()
            .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
            .limit(limit);

        } else if (categoryName === 'Skilled Nursing Facility') {
          result = await skilledNursingHome
            .find()
            .lean()
            .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
            .limit(limit);

        } else if (categoryName === 'Geriatic Care Manager') {
          result = await geriaticCareManager
            .find()
            .lean()
            .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
            .limit(limit);
        }
        // else if (categoryName === 'medicalFacilities') {
        //   result = await medicalFacilities
        //     .find()
        //     .lean()
        //     .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
        //     .limit(limit);
        // }
        // else if (categoryName === 'physician') {
        //   result = await physicians
        //     .find()
        //     .lean()
        //     .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
        //     .limit(limit);
        // }
        // else if (categoryName === 'medicareSupplier') {
        //   result = await medicalSuppliers
        //     .find()
        //     .lean()
        //     .select('name city state phoneNumber mainCategory zipCode').skip(pages * limit)
        //     .limit(limit);
        // }

        // Format the data for the list format
        return result.map((entry) => ({
          _id: entry._id,
          name: entry.name,
          state: entry.state,
          city: entry.city,
          zipCode: entry.zipCode,
          phoneNumber: entry.phoneNumber,
          mainCategory: entry.mainCategory
        }));
      };

      const scrapeAllCategories = async (categories) => {
        const promises = categories.map((categoryName) =>
          scrapeCategory(categoryName)
        );
        const results = await Promise.all(promises);
        return results;
      };


      const scrapedData = await scrapeAllCategories(name);
      // console.log(scrapedData)


      res.status(200).json(scrapedData.flat());


    } catch (err) {
      next(err)
    }
  },
// for Website
  getStateCityAndZipCode: async (req, res, next) => {
    try {

      let cacheRecords = 'records';

      const uniqureRecords = {
        cities: [],
        state: [],
        zipCode: []
      }

      const cachedData = cache.get(cacheRecords);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const promises = [
        nursingHome
          .find()
          .lean()
          .select('state city zipCode -_id'),
        // skilledNursingHome
        //   .find()
        //   .lean()
        //   .select('state city zipCode'),
        hospital.find().lean().select('state city zipCode -_id'),
        dialysisFacilityData
          .find()
          .lean()
          .select('state city zipCode -_id'),
        homeHealthData
          .find({})
          .lean()
          .select('state city zipCode -_id'),
        hoSpiceData
          .find({})
          .lean()
          .select('state city zipCode -_id'),
        inpatientRehabilitiation
          .find({})
          .lean()
          .select('state city zipCode -_id'),
        // longTermCares
        //   .find({})
        //   .lean()
        //   .select('state city zipCode -_id'),
        // independentLiving
        //   .find()
        //   .lean()
        //   .select('state city zipCode'),
        memoryCare.find().lean().select('state city zipCode -_id'),
        inHomeCare.find().lean().select('state city zipCode -_id'),
        // assistedLiving
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // adultDayCare
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // careRetirement
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // geriaticCareManager
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
          // medicalSuppliers
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
          // medicalFacilities
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
          // physicians
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
      ];

      const records = await Promise.all(promises);

      // console.log(records.flat().length,"records")


      const mergedRecords = [].concat(...records);

      // console.log(mergedRecords,"merge")
      for (let i = 0; i < mergedRecords.length; i++) {
        if (!uniqureRecords.state.includes(mergedRecords[i].state)) {
          uniqureRecords.state.push(mergedRecords[i].state);
        }
        if (!uniqureRecords.cities.includes(capitalizeFirstLetter(mergedRecords[i].city))) {
          const capitalizedCity = capitalizeFirstLetter(mergedRecords[i].city);
          uniqureRecords.cities.push(capitalizedCity);
        }
        if (!uniqureRecords.zipCode.includes(mergedRecords[i].zipCode)) {
          uniqureRecords.zipCode.push(mergedRecords[i].zipCode);
        }
      }
      uniqureRecords.state.sort();
      cache.set(cacheRecords, uniqureRecords);
      return res.status(200).json(uniqureRecords);
    } catch (error) {
      next(error)
    }
  },

  // for App

    getStateCityAndZipCodeApp: async (req, res, next) => {
    try {

      let cacheRecords = 'records';

      const uniqureRecords = {
        cities: [],
        state: [],
        zipCode: []
      }

      const cachedData = cache.get(cacheRecords);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const promises = [
        nursingHome
          .find()
          .lean()
          .select('state city zipCode -_id'),
        // skilledNursingHome
        //   .find()
        //   .lean()
        //   .select('state city zipCode'),
        // hospital.find().lean().select('state city zipCode -_id'),
        // dialysisFacilityData
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // homeHealthData
        //   .find({})
        //   .lean()
        //   .select('state city zipCode -_id'),
        // hoSpiceData
        //   .find({})
        //   .lean()
        //   .select('state city zipCode -_id'),
        inpatientRehabilitiation
          .find({})
          .lean()
          .select('state city zipCode -_id'),
        // longTermCares
        //   .find({})
        //   .lean()
        //   .select('state city zipCode -_id'),
        // independentLiving
        //   .find()
        //   .lean()
        //   .select('state city zipCode'),
        memoryCare.find().lean().select('state city zipCode -_id'),
        inHomeCare.find().lean().select('state city zipCode -_id'),
        // assistedLiving
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // adultDayCare
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // careRetirement
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
        // geriaticCareManager
        //   .find()
        //   .lean()
        //   .select('state city zipCode -_id'),
          // medicalSuppliers
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
          // medicalFacilities
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
          // physicians
          // .find()
          // .lean()
          // .select('state city zipCode -_id'),
      ];

      const records = await Promise.all(promises);

      // console.log(records.flat().length,"records")


      const mergedRecords = [].concat(...records);

      // console.log(mergedRecords,"merge")
      for (let i = 0; i < mergedRecords.length; i++) {
        if (!uniqureRecords.state.includes(mergedRecords[i].state)) {
          uniqureRecords.state.push(mergedRecords[i].state);
        }
        if (!uniqureRecords.cities.includes(capitalizeFirstLetter(mergedRecords[i].city))) {
          const capitalizedCity = capitalizeFirstLetter(mergedRecords[i].city);
          uniqureRecords.cities.push(capitalizedCity);
        }
        if (!uniqureRecords.zipCode.includes(mergedRecords[i].zipCode)) {
          uniqureRecords.zipCode.push(mergedRecords[i].zipCode);
        }
      }
      uniqureRecords.state.sort();
      cache.set(cacheRecords, uniqureRecords);
      return res.status(200).json(uniqureRecords);
    } catch (error) {
      next(error)
    }
  },

  getAllState: async (req, res, next) => {
  try {
    const cacheKey = 'allStatesList';
    const cachedStates = cache.get(cacheKey);

    if (cachedStates) {
      return res.status(200).json({ state: cachedStates });
    }

    const states = await allState.find().select('state -_id').lean();

    const stateList = Array.from(
      new Set(states.map(item => item.state?.trim()).filter(Boolean))
    ).sort();

    cache.set(cacheKey, stateList);
    return res.status(200).json({ state: stateList });
  } catch (error) {
    next(error);
  }
},


// getStateCityAndZipCodes: async (req, res, next) => {
//    try {
//     const cacheKey = 'groupedStateCityZipRecords';

//     const cachedData = cache.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json(cachedData);
//     }

//     const promises = [
//       nursingHome.find().lean().select('state city zipCode -_id'),
//       hospital.find().lean().select('state city zipCode -_id'),
//       dialysisFacilityData.find().lean().select('state city zipCode -_id'),
//       homeHealthData.find().lean().select('state city zipCode -_id'),
//       hoSpiceData.find().lean().select('state city zipCode -_id'),
//       inpatientRehabilitiation.find().lean().select('state city zipCode -_id'),
//       memoryCare.find().lean().select('state city zipCode -_id'),
//       inHomeCare.find().lean().select('state city zipCode -_id'),
//     ];

//     const allData = (await Promise.all(promises)).flat();

//     const result = {}; // state => { cities: { cityName => Set(zipCodes) } }

//     for (const item of allData) {
//       const state = item.state?.trim();
//       const city = item.city?.trim();
//       const zip = item.zipCode?.toString().trim();

//       if (!state || !city || !zip) continue;

//       const cityFormatted = capitalizeFirstLetter(city);

//       if (!result[state]) {
//         result[state] = {};
//       }

//       if (!result[state][cityFormatted]) {
//         result[state][cityFormatted] = new Set();
//       }

//       result[state][cityFormatted].add(zip);
//     }

//     // Convert to desired output format
//     const formatted = Object.entries(result).map(([state, citiesObj]) => {
//       const cities = Object.entries(citiesObj).map(([cityName, zipSet]) => ({
//         name: cityName,
//         zipCodes: Array.from(zipSet).sort(),
//       }));

//       return {
//         state,
//         cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
//       };
//     });

//     // Sort states alphabetically
//     formatted.sort((a, b) => a.state.localeCompare(b.state));

//     cache.set(cacheKey, formatted);
//     return res.status(200).json(formatted);
//   } catch (error) {
//     next(error);
//   }
// },

  // <-------------------GET CITY AND ZIPCODE USING ON THE BASIS OF STATE----------->
  getCityAndZipCodeOnSTATE: async (req, res, next) => {
    try {
      const { state, city, zipCode, name } = req.body;

      const uniqureRecords = {
        state: [],
        cities: [],
        zipCode: []
      };

      if (typeof name === 'object') {
        const scrapeCategory = async (categoryName) => {
          let query = {};

          if (state) {
            query.state = { $regex: new RegExp(state, 'i') };
          }

          if (city) {
            query.city = { $regex: new RegExp(city, 'i') };
          }

          if (zipCode) {
            query.zipCode = zipCode;
          }

          let result = [];
          if (categoryName === 'Hospital') {
            result = await hospital
              .find(query)
              .select(
                '-_id city state zipCode'
              )
              .lean();
          } 
          else if (categoryName === 'Dialysis Facility') {
            result = await dialysisFacilityData.find(query).select('-_id city state zipCode').lean();
          } else if (categoryName === 'Nursing Home') {
            result = await nursingHome
              .find(query)
              .select()
              .lean()
              .select(
                '-_id city state zipCode'
              );
          } 
          // else if (categoryName === 'Long Term Cares') {
          //   result = await longTermCares
          //     .find(query)
          //     .select()
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // } 
          else if (categoryName === 'Hospice') {
            result = await hoSpiceData
              .find(query)
              .lean()
              .select(
                '-_id city state zipCode'
              );
          } else if (categoryName === 'Inpatient Rehabilitiation') {
            result = await inpatientRehabilitiation.find(query).select(
              '-_id city state zipCode'
            ).lean();
          } 
          // else if (categoryName === 'Group Practice') {
          //   result = await groupPracticeData.find(query).select(
          //     '-_id city state zipCode'
          //   ).lean();
          // }
           else if (categoryName === 'Home Health') {
            result = await homeHealthData.find(query).select(
              '-_id city state zipCode'
            ).lean();
          } else if (categoryName === 'Independent Living') {
            result = await independentLiving
              .find(query)
              .select()
              .lean()
              .select(
                '-_id city state zipCode'
              );
          } else if (categoryName === 'Memory Care') {
            result = await memoryCare
              .find(query)
              .lean()
              .select(
                '-_id city state zipCode'
              );
          } else if (categoryName === 'In Home Care') {
            result = await inHomeCare
              .find(query)
              .lean()
              .select(
                '-_id city state zipCode'
              );
          }
          //  else if (categoryName === 'Assisted Living') {
          //   result = await assistedLiving
          //     .find(query)
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // }
          //  else if (categoryName === 'Adult Day Care') {
          //   result = await adultDayCare
          //     .find(query)
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // }
          //  else if (categoryName === 'Care Retirement Communities') {
          //   result = await careRetirement
          //     .find(query)
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // }
          //  else if (categoryName === 'Skilled Nursing Facility') {
          //   result = await skilledNursingHome
          //     .find(query)
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // }
          //  else if (categoryName === 'Geriatic Care Manager') {
          //   result = await skilledNursingHome
          //     .find(query)
          //     .lean()
          //     .select(
          //       '-_id city state zipCode'
          //     );
          // }
          // else if(categoryName='physician'){
          //   result = await physicians
          //   .find(query)
          //   .lean()
          //   .select(
          //     '-_id city state zipCode'
          //   );
          // }
          // else if(categoryName='medicalFacilities'){
          //   result = await medicalFacilities
          //   .find(query)
          //   .lean()
          //   .select(
          //     '-_id city state zipCode'
          //   );
          // }
          // else if(categoryName='medicareSupplier'){
          //   result = await medicalSuppliers
          //   .find(query)
          //   .lean()
          //   .select(
          //     '-_id city state zipCode'
          //   );
          // }
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

          let mergedRecords = scrapedData.flat()

          for (let i = 0; i < mergedRecords.length; i++) {
            if (!uniqureRecords.state.includes(mergedRecords[i].state)) {
              uniqureRecords.state.push(mergedRecords[i].state);
            }
            if (!uniqureRecords.cities.includes(capitalizeFirstLetter(mergedRecords[i].city))) {
              const capitalizedCity = capitalizeFirstLetter(mergedRecords[i].city);
              uniqureRecords.cities.push(capitalizedCity);
            }
            if (!uniqureRecords.zipCode.includes(mergedRecords[i].zipCode)) {
              uniqureRecords.zipCode.push(mergedRecords[i].zipCode);
            }
          }

          res.status(200).json(uniqureRecords)

        } catch (err) {
          next(err);
        }
      }
    } catch (error) {
      next(error)
    }
  },
  getCityAndZipCodeOnSTATEApp: async (req, res, next) => {
   
    try {
      const { state } = req.body;
      
      console.log(state,"state")
    
      const uniqueRecords = {
        cities: [],
      };
    
      let query = {};
    
      if (state) {
        query.state = { $regex: new RegExp(state, 'i') };
      }

      
    
      const nursingHomeResult = await nursingHome.find(query).select('-_id city state zipCode').lean();
      const inpatientRehabilitiationResult = await inpatientRehabilitiation.find(query).select('-_id city state zipCode').lean();
      
      
      
      const memoryCareResult = await memoryCare.find(query).select('-_id city state zipCode').lean();
      const inHomeCareResult = await inHomeCare.find(query).select('-_id city state zipCode').lean();
      // const hospitalCareResult=await hospital.find(query).select('-_id city state zipCode').lean();
      // const dialysisFacilityDataResult=await dialysisFacilityData.find(query).select('-_id city state zipCode').lean();
      // const homeHealthDataResult=await homeHealthData.find(query).select('-_id city state zipCode').lean();
      // const hoSpiceDataResult=await hoSpiceData.find(query).select('-_id city state zipCode').lean();
      // const medicalFacilitiesResult = await medicalFacilities.find(query).select('-_id city state zipCode')
      // const medicalSuppliersResult = await medicalSuppliers.find(query).select('-_id city state zipCode')
    
      const mergedRecords = [
        ...nursingHomeResult,
        ...inpatientRehabilitiationResult,
        ...memoryCareResult,
        ...inHomeCareResult,
        // ...hospitalCareResult,
        // ...dialysisFacilityDataResult,
        // ...homeHealthDataResult,
        // ...hoSpiceDataResult,
        // ...medicalFacilitiesResult,
        // ...medicalSuppliersResult
      ];
    
      const citySet = new Set(); // Using a Set to store unique city names
    
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
    
      mergedRecords.forEach(record => {
        const formattedCity = capitalizeFirstLetter(record.city); 
        if (!citySet.has(formattedCity)) {
          citySet.add(formattedCity);
          uniqueRecords.cities.push(formattedCity);
        }
      });
    
      uniqueRecords.cities.sort();
    
      res.status(200).json(uniqueRecords);
    } catch (error) {
      next(error);
    }
    
    
    
    
  },

  getCitiesByState: async (req, res, next) => {
  try {
    const { state } = req.body;

    console.log(state,"state")


    const cities = await allCities
      .find({ state: state.trim() })
      .select('city -_id')
      .lean();

    const cityList = cities
      .map(item => item.city?.trim())
      .filter(Boolean)
      .sort();

    return res.status(200).json({ cities: cityList });
  } catch (error) {
    next(error);
  }
},

  getCityAndFacilityCount: async (req, res, next) => {
    try {
      const cacheKey = 'cityFacilityCount';
      const cachedData = cache.get(cacheKey);
  
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
  
      const facilities = [
        { model: hospital },
        { model: dialysisFacilityData },
        { model: nursingHome },
        { model: hoSpiceData },
        { model: inpatientRehabilitiation },
        { model: homeHealthData },
        { model: memoryCare },
        { model: inHomeCare },
      ];
  
      
      const results = await Promise.all(
        facilities.map(async ({ model }) => {
          const data = await model.aggregate([
            {
              $group: {
                _id: { city: '$city', state: '$state' }, 
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                city: '$_id.city',
                state: '$_id.state',
                count: 1,
              },
            },
          ]);
  
          return data;
        })
      );
  
     
      const flattenedResults = results.flat();
  
  
      const groupedByCityState = flattenedResults.reduce((acc, record) => {
        const cityStateKey = `${record.city.trim().toLowerCase()}, ${record.state.trim().toLowerCase()}`;
        if (!acc[cityStateKey]) {
          acc[cityStateKey] = { city: record.city, state: record.state, totalFacilities: 0 };
        }
        acc[cityStateKey].totalFacilities += record.count;
        return acc;
      }, {});
  
  
      const predefinedCities = [
        { city: "Albuquerque", state: "New Mexico" },
        { city: "Alma", state: "Michigan" },
        { city: "Anaheim", state: "California" },
        { city: "Atlanta", state: "Georgia" },
        { city: "Austin", state: "Texas" },
        { city: "Baltimore", state: "Maryland" },
        { city: "Boston", state: "Massachusetts" },
        { city: "Buffalo", state: "New York" },
        { city: "Chicago", state: "Illinois" },
        { city: "Los Angeles", state: "California" },
        { city: "New York", state: "New York" },
        { city: "Seattle", state: "Washington" },
        { city: "San Francisco", state: "California" },
        { city: "San Diego", state: "California" },
        { city: "Dallas", state: "Texas" },
        { city: "Houston", state: "Texas" },
        { city: "Phoenix", state: "Arizona" },
        { city: "Philadelphia", state: "Pennsylvania" },
        // Adding new records
        { city: "Miami", state: "Florida" },
        { city: "Orlando", state: "Florida" },
        { city: "Denver", state: "Colorado" },
        { city: "Salt Lake City", state: "Utah" },
        { city: "Portland", state: "Oregon" },
        { city: "Las Vegas", state: "Nevada" },
      ];
      
  
      // Map predefined cities and states to their facility count
      const cityFacilityData = predefinedCities.map(({ city, state }) => {
        const cityStateKey = `${city.trim().toLowerCase()}, ${state.trim().toLowerCase()}`;
        const facilityData = groupedByCityState[cityStateKey];
        return {
          city,
          state,
          totalFacilities: facilityData ? facilityData.totalFacilities : 0,
        };
      });
  
      // Cache the result
      cache.set(cacheKey, cityFacilityData, 365 * 24 * 60 * 60);
  
      // Return the data
      res.status(200).json(cityFacilityData);
    } catch (error) {
      next(error);
    }
  },

  getCityAndFacilityCountApp: async (req, res, next) => {
    try {
      const cacheKey = 'cityFacilityCount';
      const cachedData = cache.get(cacheKey);
  
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
  
      const facilities = [
        // { model: hospital },
        // { model: dialysisFacilityData },
        { model: nursingHome },
        // { model: hoSpiceData },
        { model: inpatientRehabilitiation },
        // { model: homeHealthData },
        { model: memoryCare },
        { model: inHomeCare },
      ];
  
      
      const results = await Promise.all(
        facilities.map(async ({ model }) => {
          const data = await model.aggregate([
            {
              $group: {
                _id: { city: '$city', state: '$state' }, 
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                city: '$_id.city',
                state: '$_id.state',
                count: 1,
              },
            },
          ]);
  
          return data;
        })
      );
  
     
      const flattenedResults = results.flat();
  
  
      const groupedByCityState = flattenedResults.reduce((acc, record) => {
        const cityStateKey = `${record.city.trim().toLowerCase()}, ${record.state.trim().toLowerCase()}`;
        if (!acc[cityStateKey]) {
          acc[cityStateKey] = { city: record.city, state: record.state, totalFacilities: 0 };
        }
        acc[cityStateKey].totalFacilities += record.count;
        return acc;
      }, {});
  
  
      const predefinedCities = [
        { city: "Albuquerque", state: "New Mexico" },
        { city: "Alma", state: "Michigan" },
        { city: "Anaheim", state: "California" },
        { city: "Atlanta", state: "Georgia" },
        { city: "Austin", state: "Texas" },
        { city: "Baltimore", state: "Maryland" },
        { city: "Boston", state: "Massachusetts" },
        { city: "Buffalo", state: "New York" },
        { city: "Chicago", state: "Illinois" },
        { city: "Los Angeles", state: "California" },
        { city: "New York", state: "New York" },
        { city: "Seattle", state: "Washington" },
        { city: "San Francisco", state: "California" },
        { city: "San Diego", state: "California" },
        { city: "Dallas", state: "Texas" },
        { city: "Houston", state: "Texas" },
        { city: "Phoenix", state: "Arizona" },
        { city: "Philadelphia", state: "Pennsylvania" },
        // Adding new records
        { city: "Miami", state: "Florida" },
        { city: "Orlando", state: "Florida" },
        { city: "Denver", state: "Colorado" },
        { city: "Salt Lake City", state: "Utah" },
        { city: "Portland", state: "Oregon" },
        { city: "Las Vegas", state: "Nevada" },
      ];
      
  
      // Map predefined cities and states to their facility count
      const cityFacilityData = predefinedCities.map(({ city, state }) => {
        const cityStateKey = `${city.trim().toLowerCase()}, ${state.trim().toLowerCase()}`;
        const facilityData = groupedByCityState[cityStateKey];
        return {
          city,
          state,
          totalFacilities: facilityData ? facilityData.totalFacilities : 0,
        };
      });
  
      // Cache the result
      cache.set(cacheKey, cityFacilityData, 365 * 24 * 60 * 60);
  
      // Return the data
      res.status(200).json(cityFacilityData);
    } catch (error) {
      next(error);
    }
  },
  
  
  getProfessionalCityStateAndZipCode: async (req, res, next) => {
    try {

      const uniqureRecords = {
        state: [],
        cities: [],
        zipCode: []
      };


      const data = await Professional.aggregate([
        {
          $unwind: "$locations"
        },
        {
          $project: {
            _id: 0,
            state: 1,
            city: "$locations.city",
            zipCode: "$locations.zip_code"
          }
        }
      ])

      for (let i = 0; i < data.length; i++) {
        if (!uniqureRecords.state.includes(data[i].state)) {
          uniqureRecords.state.push(data[i].state);
        }
        if (!uniqureRecords.cities.includes(capitalizeFirstLetter(data[i].city))) {
          const capitalizedCity = capitalizeFirstLetter(data[i].city);
          uniqureRecords.cities.push(capitalizedCity);
        }
        if (!uniqureRecords.zipCode.includes(data[i].zipCode)) {
          uniqureRecords.zipCode.push(data[i].zipCode);
        }
      }


      res.status(200).json(uniqureRecords)

    } catch (error) {
      next(error)
    }
  },
  // <----------------maaz work----------------------------------->
  // : async (req, res, next) => {
  //   try {
  //     console.log('here')
  //     const { points } = req.body
  //     const capitalizeFirstLetter = (string) => {
  //       return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  //     };

  //     if (!points || !Array.isArray(points) || points.length === 0) {
  //       console.log('Invalid request body. Expecting an array of latitude and longitude pairs.')
  //       return res
  //         .status(400)
  //         .json({
  //           success: false,
  //           message:
  //             "Invalid request body. Expecting an array of latitude and longitude pairs.",
  //         });
  //     }



  //     const allRecords = await fetchDataFromDatabase();
  //     console.log(allRecords.length, "allRecords")
  //     const filteredRecords = allRecords.filter((location) => {
  //       const latitude = parseFloat(location.latitude);
  //       const longitude = parseFloat(location.longitude);
  //       return !isNaN(latitude) && !isNaN(longitude);
  //     });

  //     const features = filteredRecords.map((location) => {
  //       const latitude = parseFloat(location.latitude);
  //       const longitude = parseFloat(location.longitude);
  //       const point = [latitude, longitude];
  //       return point

  //     });

  //     let ptsWithin = turf.pointsWithinPolygon(turf.points(features), turf.polygon([points]))





  //     const coords = ptsWithin.features.map((loc) => loc.geometry.coordinates);

  //     const matchingRecords = allRecords.filter((record) => {
  //       const latitude = parseFloat(record.latitude);
  //       const longitude = parseFloat(record.longitude);
  //       const point = [latitude, longitude];
  //       return coords.some((coord) => coord[0] === point[0] && coord[1] === point[1]);
  //     }).map((record) => {
  //       return {
  //         ...record,
  //         city: capitalizeFirstLetter(record.city),
  //       }
  //     })


  //     // console.log(matchingRecords);

  //     return res.status(200).json(matchingRecords);
  //   } catch (err) {
  //     console.log(err)
  //     next(err);
  //   }
  // },
  getAllRecordsCategoryLatLong:async(req,res,next)=>{
    try {
      const { points } = req.body;

      console.log(points)

      if (!points || points.length === 0) {
          return res.status(400).json({ error: 'Points array is required' });
      }

      const polygon = createGeoPolygon(points);

      const query = {
          location: {
              $geoWithin: {
                  $geometry: polygon
              }
          }
      };

      const nursingHomes = await nursingHome.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode images overall_rating longitude latitude');
      const inpatientRehabilitations = await inpatientRehabilitiation.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode longitude latitude');
      const memoryCares = await memoryCare.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');
      const inHomeCares = await inHomeCare.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');
      const hostpitCares= await hospital.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');
      const dialysisFacilityCares= await dialysisFacilityData.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');
      const homeHealthCares= await homeHealthData.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');
      const hospiceCares= await hoSpiceData.find(query, '_id name city state mainCategory fullAddress phoneNumber zipCode photos longitude latitude');

      const results = [
          ...nursingHomes,
          ...inpatientRehabilitations,
          ...memoryCares,
          ...inHomeCares,
          ...hostpitCares,
          ...dialysisFacilityCares,
          ...homeHealthCares,
          ...hospiceCares

      ];

      res.status(200).json(results);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
  },
  getAllCategoryDataRecords: async (req, res, next) => {
    try {
      const allRecords = await fetchDataFromDatabase()
      res.status(200).json(allRecords)
    }
    catch (err) {
      next(err)
    }
  },
   getRecordsbySearch : async (req, res, next) => {
    const { search, page, limit } = req.body;
    try {
      if (search) {
        const query = {
          $or: [
            { name: { $regex: new RegExp(search, 'i') } },
            { zipCode: { $regex: new RegExp(search, 'i') } },
            { state: { $regex: new RegExp(search, 'i') } },
            { city: { $regex: new RegExp(search, 'i') } },
            { mainCategory: { $regex: new RegExp(search, 'i') } },
            // Add more fields as neededsearch
          ]
        };
  
        let result = [];
        let totalCount = 0;
  
        // const categories = ['Nursing Home', 'Inpatient Rehabilitiation', 'In Home Care', 'Memory Care'];
        const categories = [
          'Nursing Home',
          // 'Skilled Nursing Facility',
          'Hospital',
          // 'Long Term Cares',
          'Dialysis Facility',
          'Hospice',
          'Inpatient Rehabilitiation',
          // 'Group Practice',
          'Home Health',
          // 'Independent Living',
          'Memory Care',
          'In Home Care',
          // 'Assisted Living',
          // 'Adult Day Care',
          // 'Care Retirement Communities',
          // 'Geriatic Care Manager',
          // 'medicalFacilities',
          // 'medicareSupplier',
          // 'physician'
        ]
        const scrapeCategory = async (categoryName) => {
          let categoryQuery;
  
          // Handle different categories here...
          if (categoryName === 'Nursing Home') {
            categoryQuery = nursingHome;
          } else if (categoryName === 'Inpatient Rehabilitiation') {
            categoryQuery = inpatientRehabilitiation;
          } else if (categoryName === 'In Home Care') {
            categoryQuery = inHomeCare;
          } else if (categoryName === 'Memory Care') {
            categoryQuery = memoryCare;
          }
          // else if (categoryName === 'physician') {
          //   categoryQuery = physicians;
          // }
          // else if (categoryName === 'medicalFacilities') {
          //   categoryQuery = medicalFacilities;
          // }
          // else if (categoryName === 'medicareSupplier') {
          //   categoryQuery = medicalSuppliers;
          // }
          // else if(categoryName==="Skilled Nursing Facility"){
          //   categoryQuery=skilledNursingHome
          // }
  
          const categoryCount = await categoryQuery.countDocuments(query);
          const categoryResult = await categoryQuery
            .find(query)
            .select('_id name city state mainCategory fullAddress phoneNumber zipCode images overall_rating')
            .lean()
            .skip(page * limit)
            .limit(limit);
  
          totalCount += categoryCount;
          result = result.concat(categoryResult);
        };
  
        const scrapeAllCategories = async () => {
          const promises = categories.map((categoryName) => scrapeCategory(categoryName));
          await Promise.all(promises);
        };
  
        try {
          await scrapeAllCategories();
  
          res.status(200).json({ totalCount, data: result });
        } catch (err) {
          next(err);
        }
      }
    } catch (error) {
      next(error);
    }
  },
  
    updateLatLong: async (req, res, next) => {
  try {
    console.log("api")
      const documents= await medicalSuppliers.find({ location: { $exists: false } });


    
    console.log(documents.length, "documents");
    
    for (const doc of documents) {
      if(doc.latitude==="None" && doc.longitude==="None"){
      const latitude = parseFloat(doc.latitude);
      const longitude = parseFloat(doc.longitude);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      await medicalSuppliers.findByIdAndUpdate(doc._id, { $set: { location } });
    }
   
    res.status(200).json({ success: true, message: 'Data migration completed.' });
  }
}
   catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
},
//  getAllProvider: async (req, res, next) => {
//   try {
//     const { state, city, specialty,experience, zipCode,overall_rating, name, page, limit=6 ,search} = req.body;
//     // console.log(req.body)
//     // console.log(state, city, zipCode,overall_rating, name, page, limit ,search,"search");

//       if (typeof name === 'object') {
//         const scrapeCategory = async (categoryName) => {
//           let query = {};
//           console.log(query)
      
//           if (state) {
//             query.state =state
//           }

                          
//           if (city) {
//             query.city = city
//           }

//           if(specialty){
//             query.specialty = specialty
//           }
      
//           if (zipCode) {
//             query.zipCode = zipCode;
//           }
//           if (overall_rating) {
//             const overallRatings = overall_rating.map(Number);
//             query.overall_rating = { $in: overallRatings };
//         }

//             if (experience && Array.isArray(experience)) {
//       const [minExp, maxExp] = experience;

//       query.experience = {
//         $gte: minExp,
//         $lte: maxExp
//       };
//     }
        

//         if (search) {
//           const searchQuery = {
//               $or: [
//                   { name: { $regex: new RegExp(search, 'i') } },
             
//               ]
//           };
//           Object.assign(query, searchQuery);
//       }
      
//           let result = [];
//           let totalCount = 0;
      
//            if (categoryName === 'Provider') {
//             totalCount = await providerData.countDocuments(query);
//             result = await providerData
//               .find(query)
//               .select('_id name specialty experience city state mainCategory fullAddress phoneNumber zipCode images overall_ratings bio overall_rating')
//               .lean()
//               .skip(page * limit)
//               .limit(limit);
//           } 
           
//           return { result, totalCount };
//         };
      
//         const scrapeAllCategories = async (categories) => {
//           const promises = categories.map((categoryName) => scrapeCategory(categoryName));
//           const results = await Promise.all(promises);
//           return results;
//         };
      
//         try {
//           const scrapedData = await scrapeAllCategories(name);
      
//           const totalCount = scrapedData.reduce((acc, curr) => acc + curr.totalCount, 0);
//           const flatResults = scrapedData.flatMap((data) => data.result);
      
//           res.status(200).json({ totalCount, data: flatResults });        

//         } catch (err) {
//           console.log(err)
//           next(err);
//         }
//       }
     
//     } catch (error) {
//       next(error);
//     }
// },

getAllProviders: async (req, res, next) => {
  try {
    const {
      state,
      city,
      specialty,
      experience,
      zipCode,
      overall_rating,
      name,
      page = 0,
      limit = 10,
      search
    } = req.body;

    const query = {};
    if (state) query.state = state;
    if (city) query.city = city;
    if (zipCode) query.zipCode = zipCode;
    if (specialty) query.specialty = specialty;
    if (Array.isArray(name)) query.mainCategory = { $in: name };
    if (overall_rating && Array.isArray(overall_rating)) {
      query.overall_rating = { $in: overall_rating.map(Number) };
    }
    if (experience && Array.isArray(experience)) {
      const [min, max] = experience;
      query.experience = { $gte: min, $lte: max };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const isCacheable = Array.isArray(name) && name.length === 1 && name[0] === 'Provider';
    const cacheKey = isCacheable ? `provider_${JSON.stringify(query)}_${page}_${limit}` : null;

    if (isCacheable) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
    }

    const totalCount = await providerData.countDocuments(query);
    const result = await providerData
      .find(query)
      .select(
        '_id name specialty experience city state mainCategory fullAddress phoneNumber zipCode images overall_ratings bio overall_rating'
      )
      .sort(search ? { score: { $meta: "textScore" } } : {}) // Sort by score internally, but don't return it
      .skip(page * limit)
      .limit(limit)
      .lean();

    const response = { totalCount, data: result };

    if (isCacheable) {
      cache.set(cacheKey, response);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
},



// change_into_ary: async (req,res,next)=>{
//  try {
//     const result = await providerData.updateMany(
//   { },
//   [
//     {
//       $set: {
//         specialty: {
//           $cond: [
//             { $eq: [ { $type: "$specialty" }, "string" ] },
//             {
//               $map: {
//                 input: { $split: ["$specialty", ","] },
//                 as: "item",
//                 in: { $trim: { input: "$$item" } }
//               }
//             },
//             "$specialty" // leave unchanged if not a string
//           ]
//         }
//       }
//     }
//   ]
// );


//     res.status(200).json({
//       success: true,
//       message: 'Converted specialty strings to arrays (only if not already arrays).',
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Error converting specialty field:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// }


// normalizeCities: async (req, res) => {
//   try {
//     const records = await hospital.find({ city: { $exists: true } }).select('city');
//     let updatedCount = 0;

//     for (const record of records) {
//       const formattedCity = toTitleCase(record.city);
//       if (formattedCity !== record.city) {
//         await hospital.updateOne(
//           { _id: record._id },
//           { $set: { city: formattedCity } }
//         );
//         updatedCount++;
//         console.log(updatedCount)
//       }
//     }
//     console.log(records.length)

//     return res.status(200).json({
//       message: 'Cities normalized successfully.',
//       updatedCount: updatedCount,
//       totalChecked: records.length
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }


};

// Function to fetch data from the database
// const fetchDataFromDatabase = async () => {
//   const promises = [

//     nursingHome
//       .find({})
//       .lean()
//       .select('_id name latitude longitude mainCategory city state zipCode'),
//     skilledNursingHome
//       .find()
//       .lean()
//       .select('_id name latitude longitude mainCategory city state zipCode'),
//     // Professional.aggregate([
//     //   {
//     //     $unwind: "$locations",
//     //   },
//     //   {
//     //     $project: {
//     //       _id: 1,
//     //       name: 1,
//     //       mainCategory: 1,
//     //       specialities: 1,
//     //       state: 1,
//     //       zipCode: "$locations.zip_code",
//     //       city: "$locations.city",
//     //       latitude: "$locations.latitude",
//     //       longitude: "$locations.longitude",
//     //     },
//     //   },

//     // ]),
//     // hospital.find().lean().select('_id name latitude longitude mainCategory'),
//     // dialysisFacilityData
//     //   .find({})
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // homeHealthData
//     //   .find({})
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // hoSpiceData
//     //   .find({})
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     inpatientRehabilitiation
//       .find({})
//       .lean()
//       .select('_id name latitude longitude mainCategory city state zipCode'),
//     // longTermCares
//     //   .find({})
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // independentLiving
//     //   .find()
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     memoryCare.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
//     inHomeCare.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
//     // assistedLiving
//     //   .find()
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // adultDayCare
//     //   .find()
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // careRetirement
//     //   .find()
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//     // geriaticCareManager
//     //   .find()
//     //   .lean()
//     //   .select('_id name latitude longitude mainCategory'),
//   ];
//   const records = await Promise.all(promises);
//   return [].concat(...records);
// };

const fetchDataFromDatabase = async () => {
  const promises = [

    nursingHome
      .find({})
      .lean()
      .select('_id name latitude longitude mainCategory city state zipCode'),
    // skilledNursingHome
    //   .find()
    //   .lean()
    //   .select('_id name latitude longitude mainCategory city state zipCode'),
   
    inpatientRehabilitiation
      .find({})
      .lean()
      .select('_id name latitude longitude mainCategory city state zipCode'),
   
    memoryCare.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
    inHomeCare.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
    // physicians.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
    // medicalFacilities.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
    // medicalSuppliers.find().lean().select('_id name latitude longitude mainCategory city state zipCode'),
    
  ];


  const records = await Promise.all(promises);
  console.log(records[0].length, "records")
  const mergedNursingHomes=records[0].concat(records[1])
  records[0] = mergedNursingHomes;
  records.splice(1, 1);
  console.log('here')
  return [].concat(...records);
};

module.exports = healthCareController;


const capitalizeFirstLetter = (str) => {
  // console.log(str,'str')
  return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
};


// function toTitleCase(str) {
//   return str
//     .toLowerCase()
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// }