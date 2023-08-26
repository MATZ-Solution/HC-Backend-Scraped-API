const ErrorHandler = require("../utils/ErrorHandler");
const HealthCare = require("../Model/healthCareData");
const hospital = require("../Model/hospital");
const longTermCares = require("../Model/longtermCares");
const nursingHome = require("../Model/nursingHome");
const dialysisFacilityData = require("../Model/dialysisFacility");
const inpatientRehabilitiation = require("../Model/inpatientRehabilitiaion")
const hoSpiceData = require("../Model/hoSpice");

const NodeCache = require("node-cache");
const homeHealthData = require("../Model/homeHealth");
const cache = new NodeCache();


const healthCareController = {
  addData: async (req, res, next) => {
    try {
      const data = req.body;

      const newData = [];

      for (let i = 0; i < data.length; i++) {
        const { name, profile, description, category, phoneNumber, address, closed, openingHours } = data[i];

        const addressData = address.split(",");
        const fullAddress = addressData[0] ? addressData[0].trim() : "";
        const addressParts = fullAddress.split(" ");
        const city = addressParts.pop(); // Removes and returns the last element (city)

        const cityZip = addressData[1] ? addressData[1].trim() : "";

        console.log(description[0])

        const [state, zipCode] = cityZip.split(" ");

        const newHealthCare = new HealthCare({
          name,
          profile,
          city,
          description: description[0] === undefined ? "" : description[0],
          category: "Memory Care",
          phoneNumber,
          fullAddress,
          zipCode,
          state: "California",
          closed,
          openingHours: openingHours[0],
        });

        await newHealthCare.save();
        newData.push(newHealthCare);
      }

      res.status(200).json({
        success: true,
        message: "Data added successfully",
        data: newData,
      });
    } catch (err) {
      next(err);
    }
  },
  updateData: async (req, res, next) => {
    try {
      const updateCategory = await HealthCare.updateMany({ category: "Nursing Homes" }, { category: "Memory Care" });
      res.status(200).json(updateCategory);
    } catch (error) {
      next(error);
    }
  },
  mohinScrap: async (req, res, next) => {
    try {
      const data = req.body; // Assuming req.body contains an array of data objects

      const newData = [];

      for (let i = 0; i < data.length; i++) {
        const { treatment_non_traumatic_spinal_cord_disease, treatment_miscellaneous_conditions, treatment_stroke, treatment_traumatic_spinal_cord_disease, treatment_nervous_system_disorder, treatment_hip_knee_amputation_bone_join_condition, treatment_hip_or_femur_fracture, treatment_non_traumatic_brain_condition, treatment_traumatic_brain_condition, service_home_health_aide, service_medical_social_service, service_speech_therapy, service_occupational_therapy, service_physical_therapy, service_nursing_care, condition_miscellaneous_pc, condition_respiratory_pc, condition_heart_circulatory_pc, condition_stroke_pc, name, family_caregiver_survey_rating, avg_daily_census, condition_cancer_pc, condition_dementia_pc, quality_rating, hemodialysis_stations_count, number_of_certified_beds, management, address, zip_code, city, contact, latitude, longitude, overall_rating, patient_survey_rating, number_of_beds } = data[i];

        const newHealthCare = new inpatientRehabilitiation({
          name,
          fullAddress: address,
          zipCode: zip_code,
          city,
          state: "Wyoming",
          phoneNumber: contact,
          latitude,
          longitude,
          treatment_traumatic_brain_condition,
          treatment_non_traumatic_brain_condition,
          treatment_hip_or_femur_fracture,
          treatment_hip_knee_amputation_bone_join_condition,
          treatment_nervous_system_disorder,
          treatment_non_traumatic_spinal_cord_disease,
          treatment_traumatic_spinal_cord_disease,
          service_home_health_aide,
          treatment_stroke,
          treatment_miscellaneous_conditions
        });

        await newHealthCare.save();
        newData.push(newHealthCare);
      }

      res.status(200).json({
        success: true,
        message: "Data added successfully",
        data: newData,
      });
    }
    catch (err) {
      console.log(err)
    }
  },

  filterMultipleCategories: async (req, res, next) => {
    const { state, city, zipCode, name } = req.body;

    try {
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
        if (categoryName === "memoryCare") {
          result = await HealthCare.find(query).select().lean();
        } else if (categoryName === "hospitals") {
          result = await hospital.find(query).select().lean();
        } else if (categoryName === "dialysisfacilities") {
          result = await dialysisFacilityData.find(query).select().lean();
        }
        else if (categoryName === "nursingHome") {
          result = await nursingHome.find(query).select().lean();
        }
        else if (categoryName === "longTermCares") {
          result = await longTermCares.find(query).select().lean();
        }
        return result;
      };

      const scrapeAllCategories = async (categories) => {
        const promises = categories.map(categoryName => scrapeCategory(categoryName));
        const results = await Promise.all(promises);
        return results;
      };

      try {
        const scrapedData = await scrapeAllCategories(name);

        res.status(200).json(scrapedData.flat());
      } catch (err) {
        next(err);
      }
    } catch (error) {
      next(error);
    }
  },
  getCategoryData: async (req, res, next) => {
    try {
      const { name } = req.body;
      let result;

      if (typeof name === "string") {

        const cachedData = cache.get(name);
        if (cachedData) {
          res.status(200).json(cachedData);
          return;
        }

        // If data is not in cache, run query the database
        if (name === "memoryCare") {
          // result = await HealthCare.aggregate(pipeline).sort({ state: 1, city: 1 }).exec();
          result = await HealthCare.find().select("state city zipCode").lean();
        } else if (name === "hospital") {
          result = await hospital.find().select("state city zipCode ").lean();
        } else if (name === "longTermCares") {
          result = await longTermCares.find().select("state city zipCode").lean();
        } else if (name === "nursingHome") {
          result = await nursingHome.find().select("state city zipCode").lean();
        } else if (name === "Dialysis Facility") {
          result = await dialysisFacilityData.find().select("state city zipCode").lean();
        } else {
          res.status(200).json("wrong parameter");
          return;
        }

        cache.set(name, result, 365 * 24 * 60 * 60);

      } else if (typeof name === "object") {
        try {
          const scrapeCategory = async (categoryName) => {
            let result = [];
            if (categoryName === "memoryCare") {
              result = await HealthCare.find().select("state city zipCode").lean();
            } else if (categoryName === "nursingHome") {
              result = await nursingHome.find().select("state city zipCode").lean();
            } else if (categoryName === "longTermCares") {
              result = await longTermCares.find().select("state city zipCode").lean();
            } else if (categoryName === "Dialysis Facility") {
              result = await dialysisFacilityData.find().select("state city zipCode").lean();
            } else if (categoryName === "hospital") {
              result = await hospital.find().select("state city zipCode").lean();
            }

            // Format the data for the list format
            return result.map(entry => ({
              _id: entry._id,
              state: entry.state,
              city: entry.city,
              zipCode: entry.zipCode
            }));
          };

          const scrapeAllCategories = async (categories) => {
            const promises = categories.map(categoryName => scrapeCategory(categoryName));
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
      if (name === "memoryCare") {
        let result;

        if (state || city || zipCode) {
          result = await HealthCare.find(query).lean();
          res.status(200).json(result);
        } else {
          result = "wrong parameter";
          res.status(200).json({ memoryCare: result });
        }

      } else if (name === "hospital") {
        let result;
        if (state || city || zipCode) {
          result = await hospital.find(query).lean();
          res.status(200).json(result);
        } else {
          result = "wrong parameter";
          res.status(200).json({ hospital: result });
        }
      } else if (name === "longTermCares") {
        let result;
        if (state || city || zipCode) {
          result = await longTermCares.find(query).lean();
          res.status(200).json(result);
        } else {
          result = "wrong parameter";
          res.status(200).json({ longTermCares: result });
        }
      } else if (name === "nursingHome") {
        let result;
        if (state || city || zipCode) {
          result = await nursingHome.find(query).lean();
          res.status(200).json(result);
        } else {
          result = "wrong parameter";
          res.status(200).json({ longTermCares: result });
        }
      } else if (name === "Dialysis Facility") {
        let result;
        if (state || city || zipCode) {
          result = await dialysisFacilityData.find(query).lean();
          res.status(200).json(result);
        } else {
          result = "wrong parameter";
          res.status(200).json({ longTermCares: result });
        }
      } else {
        res.status(200).json("Wrong Category");
      }
    } catch (err) {
      next(err);
    }
  },
  getCategoryName: async (req, res, next) => {
    try {

      const categoryName = ["memoryCare", "hospital", "longTermCares", "nursingHome", "Dialysis Facility", "Hospice"];

      res.status(200).json(categoryName)

    } catch (err) {
      next(err);
    }
  },
  getHealthCareZipCodesData: async (req, res, next) => {
    try {
      const { name, zipCode } = req.params;
      if (name === "memoryCare") {
        let result;
        if (zipCode) {
          result = await HealthCare.aggregate([
            { $match: { zipCode } }
          ]);
        } else {
          result = "wrong parameter"
        }
        res.status(200).json(result);

      } else if (name === "hospital") {
        let result;
        if (zipCode) {
          result = await hospital.aggregate([
            { $match: { zipCode } }
          ]);
        } else {
          result = "wrong parameter"
        }
        res.status(200).json(result);
      } else if (name === "longTermCares") {

        let result;
        if (zipCode) {
          result = await longTermCares.aggregate([
            { $match: { zipCode } }
          ]);
        } else {
          result = "wrong parameter"
        }
        res.status(200).json(result);
      } else if (name === "nursingHome") {
        let result;
        if (zipCode) {
          result = await nursingHome.aggregate([
            { $match: { zipCode } }
          ]);
        } else {
          result = "wrong parameter"
        }
        res.status(200).json(result);
      } else {

        res.status(200).json("wrong params");

      }
    } catch (err) {
      next(err);
    }
  },
  getDataUsingMongoDbId: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.params;

      let data = null;

      switch (category) {
        case "memoryCare":
          data = await HealthCare.findOne({ _id: mongoDbID });
          break;
        case "hospital":
          data = await Hospital.findOne({ _id: mongoDbID });
          break;
        case "longTermCares":
        case "nursingHome": // Both use the same model
          data = await LongTermCare.findOne({ _id: mongoDbID });
          break;
        default:
          return res.status(400).json("Invalid category");
      }

      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json("No Data Found");
      }

    } catch (err) {
      next(err)
    }
  },

  //get data which is  Nearest to User
  getDataNearestToUser: async (req, res, next) => {

    const { city } = req.body;

    try {
      if (city) {

        const allData = await Promise.all([
          HealthCare.find({ city }).lean(),
          hospital.find({ city }).lean(),
          longTermCares.find({ city }).lean(),
          nursingHome.find({ city }).lean(),
          dialysisFacilityData.find({ city }).lean()
        ]);

        res.status(200).json(allData.flat())
      } else {

        const allData = await Promise.all([
          HealthCare.find({ city: "Andalusia" }).lean(),
          hospital.find({ city: "Andalusia" }).lean(),
          longTermCares.find({ city: "Andalusia" }).lean(),
          nursingHome.find({ city: "Andalusia" }).lean(),
          dialysisFacilityData.find({ city: "Andalusia" }).lean()
        ]);

        res.status(200).json(allData.flat());
      }
    } catch (err) {
      next(err)
    }

  },

  //for deletion of cities

  deleteEmptyCities: async (req, res, next) => {
    await dialysisFacilityData.deleteMany({ state: "Alaska" })
    res.status(200).json("deleted")
  }







};




module.exports = healthCareController;
