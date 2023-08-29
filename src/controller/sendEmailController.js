const sendEmail = require('../utils/email');
const Otp = require('../Model/Otp')

const EmailSender = async (req, res, next) => {

    try {

        const { to } = req.body;

        // Generate OTP
        const otp = generateOTP();

        // Send Email with OTP
        const emailOptions = {
            to,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`,
        };

        await sendEmail({ ...emailOptions, res });

        // Save OTP in the database
        const newOtp = new Otp({
            email: to,
            code: otp,
        });
        await newOtp.save();

        res.status(200).json({
            success: true,
            message: 'Email sent with OTP',
        });

    } catch (err) {
        next(err);
    }
}

const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit OTP
    return otp.toString();
};

module.exports = {
    EmailSender
}