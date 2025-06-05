import nodemailer from "nodemailer";


const mailTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: String(process.env.EMAIL_ID),
        pass: String(process.env.EMAIL_PASSWD)
    }
});


export const sendMail = async(email : string , subject : string, body : string) : Promise<Boolean> =>{
    try {
         const mail = {
            from: String(process.env.EMAIL_ID),
            to : email,
            subject,
            html: body
        }

        
        const result = await new Promise<boolean>((resolve, reject) => {
            mailTransport.sendMail(mail, (err, info) => {
                if (err) {
                    reject( false);
                } else {
                    resolve(result);
                }
            });
        });

        return result;

    } catch (error) {
        console.log("Error in Send Mail Config : ",error);
        return false;
    }
}