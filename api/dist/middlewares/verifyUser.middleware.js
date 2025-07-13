import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";
export function verifyUser(req, res, next) {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            res.status(ResponseCode.FORBIDDEN).json({ message: 'Authentication token missing!' });
            return;
        }
        const user = verifyToken(authToken);
        if (!user || typeof user !== 'object' || !('role' in user)) {
            res.status(ResponseCode.UNAUTHORIZED).json({ message: 'Invalid token!' });
            return;
        }
        req.user = user; // Assuming you've extended `Request` with `user`
        next();
    }
    catch (error) {
        console.error('Error Occurred While Verifying User:', error);
        res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
        });
    }
}
//# sourceMappingURL=verifyUser.middleware.js.map