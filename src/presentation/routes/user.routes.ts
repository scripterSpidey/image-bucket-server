import express from "express";
import {
    onAuth,
    onDeleteImages,
    onEditImages,
    onForgotPassword,
    onGetImages,
    onLogin,
    onLogout,
    onRegister,
    onResetPassword,
    onUploadImages,
    onVerify,
    onVerifyOTPforForgotPassword
} from "../gateways/authentication.gateway";
import { authenticateUser } from "../middlewares/authentication";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage });

userRouter.route('/register')
    .post(onRegister)

userRouter.route('/verify')
    .post(onVerify)

userRouter.route('/login')
    .post(onLogin)

userRouter.route('/logout')
    .post(onLogout)

userRouter.route('/forgot-password')
    .post(onForgotPassword)

userRouter.route('/forgot-password-verify')
    .post(onVerifyOTPforForgotPassword)


userRouter.route('/reset-password')
    .post(onResetPassword)

userRouter.use(authenticateUser)

userRouter.route('/image')
    .get(onGetImages)
    .post(upload.array('images'),onUploadImages)
    .delete(onDeleteImages)
    .patch(onEditImages)


userRouter.route('/auth')
    .post(onAuth)

export default userRouter; 