import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyOTP } from "../utils/otpUtils.js";
const verifyOTPMiddleware = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const isValid = await verifyOTP(otp, email);
        if (!isValid) {
            res.status(ResponseCode.BAD_REQUEST).json({
                message: "Incorrect OTP !"
            });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Error Occured While Verifying OTP :", error);
        res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};
export default verifyOTPMiddleware;
//# sourceMappingURL=verifyOTP.middleware.js.map