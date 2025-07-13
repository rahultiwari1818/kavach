import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";
export const verifyAdmin = (req, res, next) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            res
                .status(ResponseCode.FORBIDDEN)
                .json({ message: "Authentication token missing.!" });
            return;
        }
        const user = verifyToken(authToken);
        if (user.role !== "admin") {
            res
                .status(ResponseCode.UNAUTHORIZED)
                .json({ message: "Login as Admin to use this feature.!" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error Occured While Verifying User :", error);
        res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};
//# sourceMappingURL=verifyAdmin.middleware.js.map