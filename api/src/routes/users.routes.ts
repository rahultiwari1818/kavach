import { Router } from "express";
import { googleAuth, loginController, logoutController, registerController, verifyEmail,forgotPasswordSendOTP, forgotPassword, addAdminController,getAdminsController,updateActiveStatusController, getAllUsersController } from "../controllers/users.controllers.js";
import { addAdminValidations, loginValidations, registerValidations } from "../middlewares/validation-middlewares/userValidations.middleware.js";
import verifyOTPMiddleware from "../middlewares/verifyOTP.middleware.js";
import { verifySuperAdmin } from "../middlewares/verifySuperAdmin.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();



router.post("/login",loginValidations, loginController);



router.post("/register",registerValidations,verifyOTPMiddleware,registerController);


router.post("/verify-email",verifyEmail);


router.post("/logout",logoutController)


router.post("/googleAuth",googleAuth);

router.post("/sendOTP",forgotPasswordSendOTP)

router.post("/forgot-password",forgotPassword);

router.post("/add-admin",verifySuperAdmin,addAdminValidations,addAdminController);

router.get("/admins",verifySuperAdmin,getAdminsController);

router.patch("/updateActiveStatus/:userId",verifySuperAdmin,updateActiveStatusController);

router.get("/get-all-users",verifyAdmin,getAllUsersController);

export default router;
