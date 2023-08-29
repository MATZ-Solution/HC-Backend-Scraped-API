require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    "755309505753-i1bthdnl4gbvpc0eipcivnotg4gn5thf.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
    );
    

  oauth2Client.setCredentials({
    refresh_token: "1//0403hO-ql4fj8CgYIARAAGAQSNwF-L9Ir3fKKHGwrdkIFRLAnK2AOYFJDFkycGbggjQbpIhDDGIlLzjXs_udHY6x4CpzhZC8Ttik",
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access Gmail token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "ns265331@gmail.com",
      accessToken,
      clientId: "755309505753-i1bthdnl4gbvpc0eipcivnotg4gn5thf.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//0403hO-ql4fj8CgYIARAAGAQSNwF-L9Ir3fKKHGwrdkIFRLAnK2AOYFJDFkycGbggjQbpIhDDGIlLzjXs_udHY6x4CpzhZC8Ttik",
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html, res }) => {
  try {
    const emailTransporter = await createTransporter();
    const emailOptions = {
      from: "noreply@gmail.com",
      to,
      subject,
      text,
    };

    // Send the email
    emailTransporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          errors: [`Something went wrong, please try again later`],
        });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          success: true,
          message: "Email sent successfully",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      ? res.status(500).json({
          success: false,
          errors: [`Something went wrong, please try again later`],
        })
      : false;
  }
};

module.exports = sendEmail;
