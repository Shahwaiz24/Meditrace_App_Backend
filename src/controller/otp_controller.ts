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
            from: 'Meditrace Team <shahwaizafzal90@gmail.com>',
            to: email,
            subject: 'Meditrace Account Password Reset OTP',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #F5BB32;">Meditrace OTP Verification</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your Meditrace account.</p>
            <p>Your <strong>OTP code</strong> is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #44BFB9;">${otp}</p>
            <p>This code is valid for the next 5 minutes. Please do not share this code with anyone.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <br/>
            <p>Thank you,</p>
            <p><strong>Meditrace Team</strong></p>
        </div>
    `
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
