require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    "314005293340-9eh88g6318enm271d5ti60538lfsr43k.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
  );


  oauth2Client.setCredentials({
    refresh_token: "1//04Wxi4FWoX8gkCgYIARAAGAQSNwF-L9Irbklu1UNsgBybAnRz5UAtNKLe-p_tRWHBn7kIHow8eRBKhAIv5x9sdhuoaW_rvl1VZRQ",
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
      type: 'OAuth2',
      user: 'maazurrehman42@gmail.com',
      accessToken,
      clientId:
        '314005293340-9eh88g6318enm271d5ti60538lfsr43k.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken:
        '1//04Wxi4FWoX8gkCgYIARAAGAQSNwF-L9Irbklu1UNsgBybAnRz5UAtNKLe-p_tRWHBn7kIHow8eRBKhAIv5x9sdhuoaW_rvl1VZRQ',
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html, res }) => {
  try {
    const emailTransporter = await createTransporter();
    const emailOptions = {
      from: "maazurrehman42@gmail.com",
      to,
      subject,
      text,
    };

    return new Promise((resolve, reject) => {
      emailTransporter.sendMail(emailOptions, (err, info) => {
        if (err) {
          console.log(err);
          reject(err); // Notify caller about the failure
        } else {
          console.log("Email sent:", info.response);
          resolve(true); // Notify caller about successful email sending
        }
      });
    });
  } catch (err) {
    console.log(err);
    return false; // Return false to indicate failure
  }
};

module.exports = sendEmail;
