import nodemailer from "nodemailer";
import { otpHTMLBody } from "../utils/otpUtils.js";


const mailTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: String(process.env.EMAIL_ID),
        pass: String(process.env.EMAIL_PASSWD)
    }
});


export const sendMail = async (
  email: string,
  subject: string,
  body: string
): Promise<boolean> => {
  try {
    const mail = {
      from: String(process.env.EMAIL_ID),
      to: email,
      subject,
      html: body,
    };

    await new Promise<void>((resolve, reject) => {
      mailTransport.sendMail(mail, (err, info) => {
        if (err) {
          console.error('SendMail Error:', err);
          return reject(err); // better to reject with error
        }
        resolve();
      });
    });

    return true;
  } catch (error) {
    console.log('Error in Send Mail Config:', error);
    return false;
  }
};