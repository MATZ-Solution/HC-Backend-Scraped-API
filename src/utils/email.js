require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    "339736576493-6f2m4bhr51oddu81foqnvqema7a34d0t.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
  );


  oauth2Client.setCredentials({
    refresh_token: "1//04ZPgPMNGNQdBCgYIARAAGAQSNwF-L9Ir030qDFXi9jl8D4aJIjeiZ3IftGjGxUTQ4MRSpTlBaX0CLEHBUThEcY7ylx9GFUzhMlw",
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
      user: 'healthcareinfoamerican@gmail.com',
      accessToken,
      clientId:
        '339736576493-6f2m4bhr51oddu81foqnvqema7a34d0t.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken:
        '1//04ZPgPMNGNQdBCgYIARAAGAQSNwF-L9Ir030qDFXi9jl8D4aJIjeiZ3IftGjGxUTQ4MRSpTlBaX0CLEHBUThEcY7ylx9GFUzhMlw',
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html, res }) => {
  try {
    const emailTransporter = await createTransporter();
    const emailOptions = {
      from: "healthcareinfoamerican@gmail.com",
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
