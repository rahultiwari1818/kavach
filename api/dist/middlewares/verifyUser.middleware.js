import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";
export async function verifyUser(req, res, next) {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            return res.status(ResponseCode.FORBIDDEN).json({ message: "Authentication token missing.!" });
        }
        const user = verifyToken(authToken);
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error Occured While Verifying User :", error);
        res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}
//# sourceMappingURL=verifyUser.middleware.js.map