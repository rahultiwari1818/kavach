import nodemailer from "nodemailer";
const mailTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: String(process.env.EMAIL_ID),
        pass: String(process.env.EMAIL_PASSWD)
    }
});
export const sendMail = async (email, subject, body) => {
    try {
        const mail = {
            from: String(process.env.EMAIL_ID),
            to: email,
            subject,
            html: body,
        };
        await new Promise((resolve, reject) => {
            mailTransport.sendMail(mail, (err, info) => {
                if (err) {
                    console.error('SendMail Error:', err);
                    return reject(err); // better to reject with error
                }
                resolve();
            });
        });
        return true;
    }
    catch (error) {
        console.log('Error in Send Mail Config:', error);
        return false;
    }
};
//# sourceMappingURL=mail.config.js.map