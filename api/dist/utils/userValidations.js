import { ResponseCode } from "./responseCode.enum.js";
export const loginValidations = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Email is required" });
            return;
        }
        if (!password) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Error Occured In Login Validations : ", error);
    }
};
export const registerValidations = (req, res, next) => {
    try {
        const { name, email, password, otp } = req.body;
        if (!name) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Name is required" });
            return;
        }
        if (!email) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Email is required" });
            return;
        }
        if (!password) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
            return;
        }
        if (!otp) {
            res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Error Occured In Register Validations : ", error);
    }
};
//# sourceMappingURL=userValidations.js.map