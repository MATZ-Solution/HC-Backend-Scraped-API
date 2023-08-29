const express = require('express');
const { EmailSender } = require('../controller/sendEmailController');
const router = express.Router();



router.route('/').post(EmailSender);



module.exports = router;
