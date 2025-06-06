import { sendMail } from "../config/mail.config.js";
import { client } from "../config/redis.config.js";
import { emailHTMLTemplate } from "./utils.js";

export function generateOTP(): string {
  const length = 6;
  const otp = Math.floor(
    Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)) +
      Math.pow(10, length - 1)
  );
  return otp.toString();
}

export const sendOTP = async (email: string): Promise<Boolean> => {
  try {
    const otp: string = generateOTP();
    await client.set(email, otp);
    const resp = await sendMail(
      email,
      "Verification OTP",
      otpHTMLBody(
        `Your OTP is ${otp}.\n
      Do not Share this with anyone.
      `
      )
    );
    return resp;
  } catch (error) {
    console.error(" Error while Sending OTP :", error);
    return false;
  }
};

export const verifyOTP = async (
  otp: string,
  email: string
): Promise<Boolean> => {
  try {
    const storedOtp = await client.get(email);
    await client.del(email);
    return storedOtp === otp;
  } catch (error) {
    console.error(" Error while Verifying OTP :", error);
    return false;
  }
};

export const otpHTMLBody = (body: string): string => {
  const htmlBody = `
        <p>${body}
        <p>
    `;
  return emailHTMLTemplate(htmlBody);
};
