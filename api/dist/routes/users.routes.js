import { Router } from "express";
import { googleAuth, loginController, logoutController, registerController, verifyEmail, forgotPasswordSendOTP, forgotPassword } from "../controllers/users.controllers.js";
import { loginValidations, registerValidations } from "../middlewares/validation-middlewares/userValidations.middleware.js";
import verifyOTPMiddleware from "../middlewares/verifyOTP.middleware.js";
const router = Router();
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidations, loginController);
router.post("/register", registerValidations, verifyOTPMiddleware, registerController);
router.post("/verify-email", verifyEmail);
router.post("/logout", logoutController);
router.post("/googleAuth", googleAuth);
router.post("/sendOTP", forgotPasswordSendOTP);
router.post("/forgot-password", forgotPassword);
export default router;
//# sourceMappingURL=users.routes.js.map