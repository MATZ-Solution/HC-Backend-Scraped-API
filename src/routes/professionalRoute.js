const professionalrouter = require('express').Router();
const professionalController = require('../controller/professionalController');

//==========Professional Controller====================
professionalrouter.route('/getProfessionalCategoryName').get(professionalController.getProfessionalSpeciality);
professionalrouter.route('/getProfessionalLocation').post(professionalController.getProfessionllocation);
professionalrouter.route('/getProfessionalsData').post(professionalController.getProfessionalsData);
professionalrouter.route('/getProfessionalsbyCities').post(professionalController.getProfessionalsDataForCity)
//====================================================

//<--------------------------Get Professional Using State
professionalrouter.route('/getProfessionalsUsingState').post(professionalController.getProfessionalsUsingState)


module.exports = professionalrouter;