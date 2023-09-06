const express = require('express');
const healthCare = require('../controller/HealthCareController');
const router = express.Router();

router.route("/").post(healthCare.addData);
router.route("/").put(healthCare.updateData);
router.route("/mohinScrap").post(healthCare.mohinScrap);

//getting states
router.route("/stateData").post(healthCare.getCategoryData);
router.route("/stateData/:name").get(healthCare.getCategoryData);
router.route("/state/:name").post(healthCare.getHealthCareStateData);
router.route("/getCategoryName").get(healthCare.getCategoryName);
router
  .route("/zipCode/:name/:zipCode?")
  .get(healthCare.getHealthCareZipCodesData);

router.route("/dltemptycities").get(healthCare.deleteEmptyCities);

//getProfessionalSpecialty
// router.route('/getProfessionalSpeciality').get(healthCare.getSpecialitiesExcel);

//found data using mongo db id and category
//using normal api
router.post("/getCategoryDataUsingMongoId", healthCare.getDataUsingMongoDbId);

//get data which is nearest to user
router.post("/getDataNearestToUser", healthCare.getDataNearestToUser);

//filter data on the basis of multiple Categories

router.post('/filterDataUsingMultipleCategories', healthCare.filterMultipleCategories);

router.get(
  "/incCounterBaseOnTheCustomerContact/:mongoDbID/:category",
  healthCare.incCounterBaseOnTheCustomerContact
);

//approve review
router.put("/approveReview", healthCare.approveReview);

//add review

// router.post('/addReview', healthCare.addReview);

//add complain
router.put("/addComplain", healthCare.addComplain);

//verifyOtp
router.post("/verifyOtp", healthCare.verifyOtp);

//get corporate using mongo db id
router.post("/getCorporatesUsingMongoId", healthCare.getCorporatesUsingMongoId);

module.exports = router;
