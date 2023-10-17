const express = require('express');
const { EmailSender,emailSend } = require('../controller/sendEmailController');
const router = express.Router();



router.route('/').post(EmailSender);
router.route('/user').post(emailSend);



module.exports = router;
