import nodemailer from "nodemailer"
import { EMAIL, EMAIL_PASSKEY } from "../constants/env";

export const sendOTP = async(email:string,otp:number)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSKEY
        }
    })

    const mailOptions = {
        from: "Image Bucket",
        to: email,
        subject: "Verify yout email",
        html: `
        <h1 style="color: blue; text-align: center;">Welcome</h1>
        <p style="font-size: 16px; color: #333; text-align: center;">Please enter the OTP provided to register on our website.</p>
        <h2 style=" color: #333; text-align: center;">${otp}</h2>
        `
    }

    await transporter.sendMail(mailOptions);
}