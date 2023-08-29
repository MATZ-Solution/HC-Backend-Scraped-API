const ErrorHandler = require("../utils/ErrorHandler");
const hospital = require("../Model/hospital");
const longTermCares = require("../Model/longtermCares");
const nursingHome = require("../Model/nursingHome");
const dialysisFacilityData = require("../Model/dialysisFacility");
const inpatientRehabilitiation = require("../Model/inpatientRehabilitiaion")
const hoSpiceData = require("../Model/hoSpice");
const groupPracticeData = require("../Model/groupPractice")
const homeHealthData = require("../Model/homeHealth");
const Otp = require("../Model/Otp")

const NodeCache = require("node-cache");

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
      const updateCategory = await homeHealthData.updateMany({ mainCategory: "home Health" });
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
        const { name, state, specialities } = data[i];

        const newHealthCare = new groupPracticeData({
          name,
          state: "Oklahoma",
          specialities,
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

      if (typeof name === "object") {


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
          if (categoryName === "Hospital") {
            result = await hospital.find(query).select().lean();
          } else if (categoryName === "Dialysis Facility") {
            result = await dialysisFacilityData.find(query).select().lean();
          }
          else if (categoryName === "Nursing Home") {
            result = await nursingHome.find(query).select().lean();
          }
          else if (categoryName === "Long Term Cares") {
            result = await longTermCares.find(query).select().lean();
          }
          else if (categoryName === "Ho Spice") {
            result = await hoSpiceData.find(query).select().lean();
          }
          else if (categoryName === "Inpatient Rehabilitiation") {
            result = await inpatientRehabilitiation.find(query).select().lean();
          }
          else if (categoryName === "Group Practice") {
            result = await groupPracticeData.find(query).select().lean();
          }
          else if (categoryName === "Home Health") {
            result = await homeHealthData.find(query).select().lean();
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

      } else if (typeof name === "string") {

        const cachedData = cache.get(name);
        if (cachedData) {
          res.status(200).json(cachedData);
          return;
        }

        // If data is not in cache, run query the database
        if (name === "Hospital") {
          result = await hospital.find().lean();
        } else if (name === "Long Term Cares") {
          result = await longTermCares.find().lean();
        } else if (name === "Nursing Home") {
          result = await nursingHome.find().lean();
        } else if (name === "Dialysis Facility") {
          result = await dialysisFacilityData.find().lean();
        } else if (name === "Ho Spice") {
          result = await hoSpiceData.find().lean();
        } else if (name === "Inpatient Rehabilitiation") {
          result = await inpatientRehabilitiation.find().lean();
        } else if (name === "Group Practice") {
          result = await groupPracticeData.find().lean();
        } else if (name === "Home Health") {
          result = await homeHealthData.find().lean();
        } else {
          res.status(200).json("wrong parameter");
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

      if (typeof name === "string") {

        const cachedData = cache.get(name);
        if (cachedData) {
          res.status(200).json(cachedData);
          return;
        }

        // If data is not in cache, run query the database
        if (name === "Hospital") {
          result = await hospital.find().select("state city zipCode ").lean();
        } else if (name === "Long Term Cares") {
          result = await longTermCares.find().select("state city zipCode").lean();
        } else if (name === "Nursing Home") {
          result = await nursingHome.find().select("state city zipCode").lean();
        } else if (name === "Dialysis Facility") {
          result = await dialysisFacilityData.find().select("state city zipCode").lean();
        } else if (name === "Ho Spice") {
          result = await hoSpiceData.find().select("state city zipCode").lean();
        } else if (name === "Inpatient Rehabilitiation") {
          result = await inpatientRehabilitiation.find().select("state city zipCode").lean();
        } else if (name === "Group Practice") {
          result = await groupPracticeData.find().select("state city zipCode").lean();
        } else if (name === "Home Health") {
          result = await homeHealthData.find().select("state city zipCode").lean();
        } else {
          res.status(200).json("wrong parameter");
          return;
        }

        cache.set(name, result, 365 * 24 * 60 * 60);

      } else if (typeof name === "object") {
        try {
          const scrapeCategory = async (categoryName) => {
            let result = [];
            if (categoryName === "Nursing Home") {
              result = await nursingHome.find().select("state city zipCode").lean();
            } else if (categoryName === "Long Term Cares") {
              result = await longTermCares.find().select("state city zipCode").lean();
            } else if (categoryName === "Dialysis Facility") {
              result = await dialysisFacilityData.find().select("state city zipCode").lean();
            } else if (categoryName === "Hospital") {
              result = await hospital.find().select("state city zipCode").lean();
            } else if (categoryName === "Ho Spice") {
              result = await hoSpiceData.find().select("state city zipCode").lean();
            } else if (categoryName === "Inpatient Rehabilitiation") {
              result = await inpatientRehabilitiation.find().select("state city zipCode").lean();
            } else if (categoryName === "Group Practice") {
              result = await groupPracticeData.find().select("state city zipCode").lean();
            } else if (categoryName === "Home Health") {
              result = await homeHealthData.find().select("state city zipCode").lean();
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
      if (name === "Long Term Cares") {
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

      const categoryName = ["Hospital", "Long Term Cares", "Nursing Home", "Dialysis Facility", "Ho Spice", "Inpatient Rehabilitiation"
        , "Group Practice", "Home Health"
      ];

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
  incCounterBaseOnTheCustomerContact: async (req, res, next) => {
    try {
      const { mongoDbID, category } = req.params;

      console.log(mongoDbID, category)

      switch (category) {
        case "hospital":
          await hospital.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "longTermCares":
          await longTermCares.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "nursingHome":
          await nursingHome.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "dialysisFacilityData":
          await dialysisFacilityData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "inpatientRehabilitiation":
          await inpatientRehabilitiation.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "hoSpiceData":
          await hoSpiceData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "groupPracticeData":
          await groupPracticeData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "home Health":
          await homeHealthData.updateOne(
            { _id: mongoDbID },
            { $inc: { contactedCustomer: 1 } }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        default:
          res.status(400).json({ success: false, message: "Invalid category" });
      }
    } catch (err) {
      next(err);
    }
  },
  addReview: async (req, res, next) => {
    try {
      const { mongoDbID, category, name, email, reviews, startRating } = req.body;

      switch (category) {
        case "hospital":
          await hospital.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "longTermCares":
          await longTermCares.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "nursingHome":
          await nursingHome.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "dialysisFacilityData":
          await dialysisFacilityData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "inpatientRehabilitiation":
          await inpatientRehabilitiation.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "hoSpiceData":
          await hoSpiceData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "groupPracticeData":
          await groupPracticeData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "home Health":
          await homeHealthData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { reviews: { name, email, reviews, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        default:
          res.status(400).json({ success: false, message: "Invalid category" });
      }
    } catch (err) {
      next(err);
    }
  },
  addComplain: async (req, res, next) => {
    try {
      const { mongoDbID, category, name, email, complain, startRating } = req.body;

      switch (category) {
        case "hospital":
          await hospital.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "longTermCares":
          await longTermCares.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "nursingHome":
          await nursingHome.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "dialysisFacilityData":
          await dialysisFacilityData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "inpatientRehabilitiation":
          await inpatientRehabilitiation.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "hoSpiceData":
          await hoSpiceData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "groupPracticeData":
          await groupPracticeData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        case "home Health":
          await homeHealthData.findOneAndUpdate(
            { _id: mongoDbID },
            { $push: { complain: { name, email, complain, startRating } } },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Updated" });
          break;
        default:
          res.status(400).json({ success: false, message: "Invalid category" });
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
          hospital.find({ city }).lean(),
          longTermCares.find({ city }).lean(),
          nursingHome.find({ city }).lean(),
          dialysisFacilityData.find({ city }).lean(),
          hoSpiceData.find({ city }).lean(),
          homeHealthData.find({ city }).lean(),
          inpatientRehabilitiation.find({ city }).lean(),
          groupPracticeData.find({ city }).lean()
        ]);

        res.status(200).json(allData.flat())
      } else {

        const allData = await Promise.all([
          HealthCare.find({ city: "Andalusia" }).lean(),
          hospital.find({ city: "Andalusia" }).lean(),
          longTermCares.find({ city: "Andalusia" }).lean(),
          nursingHome.find({ city: "Andalusia" }).lean(),
          dialysisFacilityData.find({ city: "Andalusia" }).lean(),
          hoSpiceData.find({ city }).lean(),
          homeHealthData.find({ city }).lean(),
          inpatientRehabilitiation.find({ city }).lean(),
          groupPracticeData.find({ city }).lean()
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
  },

  verifyOtp: async (req, res, next) => {
    const { email, code } = req.body;
    try {
      let data = await Otp.findOne({ email: email, code: code });
      if (data) {
        res.status(200).json({ msg: "Email Verified" });
      } else {
        throw new ErrorHandler("Invalid OTP", 400);
      }
    } catch (error) {
      next(error)
    }

  }







};




module.exports = healthCareController;
