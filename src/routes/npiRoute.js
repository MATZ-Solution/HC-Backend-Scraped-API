const npirouter = require('express').Router();
const npiController = require('../controller/npiController');

//==========Professional Controller====================


npirouter.route('/getNpiData').get(npiController.getNpiData);
npirouter.route('/getDataByState').get(npiController.getNpiDataByState)
npirouter.route('/getDataByCity').get(npiController.getNpiDataByCity)
npirouter.route("/getDataById").get(npiController.getNpiDataById)

// professionalrouter.route('/getProfessionalLocation').post(professionalController.getProfessionllocation);
// professionalrouter.route('/getProfessionalsData').post(professionalController.getProfessionalsData);
// professionalrouter.route('/getProfessionalsbyCities').post(professionalController.getProfessionalsDataForCity)
// //====================================================

// //<--------------------------Get Professional Using State
// professionalrouter.route('/getProfessionalsUsingState').post(professionalController.getProfessionalsUsingState)


module.exports = npirouter;