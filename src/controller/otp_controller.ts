import express from "express";
import OtpModel from "../model/otp_model";

const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shahwaizafzal90@gmail.com', // Your Gmail
        pass: 'ovob qtty jvug mimp' // Your Gmail App Password (Make sure to enable 'Less Secure Apps' on Gmail)
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
        transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
            if (error) {
                console.log(`Error Of OTP: ${error}`); // Logs the error to the console
                return response.status(500).send({
                    Status: 'Error sending OTP',
                    error: error.toString(), // Sends the error message as a response
                });
            }

            // Return the OTP and the success message in the response
            console.log('OTP sent successfully:', info.response); // Logs success message to the console
            return response.status(200).send({
                message: 'OTP sent successfully',
                OTP: otp, // Send the OTP back in the response
            });
        });

    }



}
