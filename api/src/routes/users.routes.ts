import { Router } from "express";
import { loginController, logoutController, registerController, verifyEmail } from "../controllers/users.controllers.js";
import { loginValidations, registerValidations } from "../utils/userValidations.js";
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
router.post("/login",loginValidations, loginController);



router.post("/register",registerValidations,verifyOTPMiddleware,registerController);


router.post("/verify-email",verifyEmail);


router.post("/logout",logoutController)



export default router;
