const professionalrouter = require('express').Router();
const professionalController = require('../controller/professionalController');

//==========Professional Controller====================
professionalrouter.route('/getProfessionalCategoryName').get(professionalController.getProfessionalSpeciality);
professionalrouter.route('/getProfessionalLocation').post(professionalController.getProfessionllocation);
//====================================================

module.exports = professionalrouter;