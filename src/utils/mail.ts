const nodemailer = require("nodemailer");
const { google } = require("googleapis");

import {
  SENDER_EMAIL_ID,
  OAUTH_CLIENT_ID,
  OAUTH_REDIRECT_URI,
  OAUTH_REFRESH_TOKEN,
  OAUTH_SECRET,
} from "../config";

/**
 * 
 * @brief: get transporter object for sending mail
 * @returns {Promise<any>}
 */
const getTransporter = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        OAUTH_CLIENT_ID,
        OAUTH_SECRET,
        OAUTH_REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
      const access_token = await oAuth2Client.getAccessToken();

      let transporter: any = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: SENDER_EMAIL_ID, // generated ethereal user
          clientId: OAUTH_CLIENT_ID,
          clientSecret: OAUTH_SECRET,
          refreshToken: OAUTH_REFRESH_TOKEN,
          accessToken: access_token,
        },
      });
      resolve(transporter);
      return;
    } catch (error) {
      reject(error);
      return;
    }
  });
};


/**
 * 
 * @brief: send mail function using transporter object & oAuth2Client
 * @param email 
 * @param subject 
 * @param body 
 * @returns 
 */
const sendMail = (email: string, subject: string, body: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter: any = await getTransporter();
      await transporter.sendMail({
        from: `"GURUCOOL" <${SENDER_EMAIL_ID}>`, // sender address
        to: `${email}`,
        subject: `${subject}`,
        html: `${body}`,
      });
      resolve("mail sent");
    } catch (error) {
      reject(error);
    }
  });
};

export default sendMail;
