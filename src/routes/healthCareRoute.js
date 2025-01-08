const express = require('express');
const healthCare = require('../controller/HealthCareController');
const { verifyTokenForFav } = require('../middleware/verifytokens');
const router = express.Router();

router.route('/').post(healthCare.addData);
router.route('/').put(healthCare.updateData);
router.route('/mohinScrap').post(healthCare.mohinScrap);

//getting states
router.route('/stateData').post(healthCare.getCategoryData);
router.route('/stateData/:name').get(healthCare.getCategoryData);
router.route('/state/:name').post(healthCare.getHealthCareStateData);
router.route('/getCategoryName').get(healthCare.getCategoryName);
router
  .route('/zipCode/:name/:zipCode?')
  .get(healthCare.getHealthCareZipCodesData);

router.route('/dltemptycities').get(healthCare.deleteEmptyCities);
router.get('/latlong', healthCare.updateLatLong);
//getProfessionalSpecialty
// router.route('/getProfessionalSpeciality').get(healthCare.getSpecialitiesExcel);

//found data using mongo db id and category
//using normal api
router.post('/getCategoryDataUsingMongoId', healthCare.getDataUsingMongoDbId);

//get data which is nearest to user
router.post('/getDataNearestToUser', healthCare.getDataNearestToUser);

//filter data on the basis of multiple Categories

router.post(
  '/filterDataUsingMultipleCategories',
  healthCare.filterMultipleCategories
);

router.get(
  '/incCounterBaseOnTheCustomerContact/:mongoDbID/:category',
  healthCare.incCounterBaseOnTheCustomerContact
);

//approve review
router.put('/approveReview', healthCare.approveReview);

//approve complain
router.put('/approveComplain', healthCare.approveComplain);

//verifyOtp
router.post('/verifyOtp', healthCare.verifyOtp);

//get corporate using mongo db id
router.post('/getCorporatesUsingMongoId', healthCare.getCorporatesUsingMongoId);

//findRecordsonthebasisoflatitudeandlongitude

router.get('/getAllRecordsCategory', healthCare.getAllRecordsCategory);

router.get('/getProfessionalCategory', healthCare.getProfessionalCategory);

//count all categories Records
router.get('/countAllCatRecords', healthCare.countAllCatRecords);

//get Record Using Category
router.get('/getRecordsUsingCat/:cat', healthCare.getRecordsUsingCat);

//fetch new Nursing Home Records
router.get(
  '/fetchNewNursingHomeRecords',
  healthCare.fetchNewNursingHomeRecords
);

//get Multiple Cat
router.post('/getMultipleCat', healthCare.getMultipleCategories);
router.get('/getMultipleCatApp',verifyTokenForFav, healthCare.getMultipleCategoriesApp);

router.get(
  '/getProfessionalRecords',
  healthCare.getProfessionalEachSpecialityRecords
);

//<-------------------get Records Using Professional Speciality -------------------------->
router.get(
  '/getRecordsUsingProfessionalspeciality/:speciality',
  healthCare.getRecordsUsingProfessionalSpeciality
);

router.get('/getDataUsingZipCode/:zipCode', healthCare.getDataUsingZipCode);

router.get(
  '/getProfessionalsUsingZipCode/:zipCode',
  healthCare.getProfessionalsUsingZipCode
);

//<---------------------get Multiple Categories ---------------------------------->

router.post('/getMutilpleCategories', healthCare.getMultipleCategoryData)

// router.get('/testapi',healthCare.testApi)

//<------------------------getStateCityAndZipCode-------------------------------->
router.get('/getStateCityAndZipCode', healthCare.getStateCityAndZipCode)

router.get('/getCityFacility', healthCare.getCityAndFacilityCount)


// <-------------------GET CITY AND ZIPCODE USING ON THE BASIS OF STATE----------->
router.post('/getCityAndZipCodeOnSTATE', healthCare.getCityAndZipCodeOnSTATE)
router.post('/getCityAndZipCodeOnSTATEApp', healthCare.getCityAndZipCodeOnSTATEApp)

//<--------------------Get Professional City state and ZipCode
router.get('/getProfessionalCityStateAndZipCode', healthCare.getProfessionalCityStateAndZipCode)


//<-------------maaz work----------------------------->
router.post('/getAllRecordsCategoryOnLatLong', healthCare.getAllRecordsCategoryLatLong)

router.get('/getAllCategoryRecords', healthCare.getAllCategoryDataRecords)

router.get('/searchByZipCode/:page?/:limit?/:zipCode?',healthCare.filterZipCode)

router.get('/searchByZipCodeApp',healthCare.filterZipCodeForApp)

router.post('/searchIngRecords',healthCare.getRecordsbySearch)

// router.get('/addlocation',healthCare.addLocation)

module.exports = router;
