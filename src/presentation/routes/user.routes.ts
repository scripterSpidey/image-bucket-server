import express from "express";
import { onAuth, onLogin, onLogout, onRegister, onVerify } from "../gateways/authentication.gateway";
import { authenticateUser } from "../middlewares/authentication";
const userRouter = express.Router();



userRouter.route('/register')
    .post(onRegister)

userRouter.route('/verify')
    .post(onVerify)

userRouter.route('/login')
    .post(onLogin)

userRouter.route('/logout')
    .post(onLogout)

userRouter.use(authenticateUser)



userRouter.route('/auth')
    .post(onAuth)

export default userRouter;