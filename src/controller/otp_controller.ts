import express from "express";
import OtpModel from "../model/otp_model";

const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shahwaizafzal90@gmail.com', // Your Gmail
        pass: 'shahwaiz@dev' // Your Gmail App Password (Make sure to enable 'Less Secure Apps' on Gmail)
    }
});
export default class OtpController {

    static async sendOtp(request: express.Request, response: express.Response) {
        let body: OtpModel = request.body;
        const email = body.email;
        const otp = await crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

        const mailOptions = {
            from: 'shahwaizafzal90@gmail.com',
            to: email,
            subject: 'Your Password Reset OTP Code Of Your Meditrace Account',
            text: `Your OTP code is ${otp}`
        };
        transporter.sendMaill(mailOptions, (error: Error | null, info: any) => {
            console.log(`Error Of OTP : ${error}`);
            if (error) {
                return response.status(500).send({
                    "Status": 'Error sending OTP',
                    "error": error.toString()
                });
            }
            // Return the OTP in the response
            response.status(200).send({ "message": 'OTP sent successfully', "OTP": otp });
        });
    }



}
