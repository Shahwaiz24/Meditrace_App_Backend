import express from "express";
import OtpModel from "../model/otp_model";
import { Db } from "mongodb";
import Database from "../config/database";

const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'meditraceapp@gmail.com', 
        pass: 'rixx idsz brkf gkts' 
    }
});
export default class OtpController {

    static async sendOtp(request: express.Request, response: express.Response) {
       try {
         let body: OtpModel = request.body;
         const email = body.email;
         let db: Db = await Database.getDatabase();
         let check = {
             email: body.email
         };
         let collection = db.collection("users");
         let user = await collection.findOne(check);
         if (!user) {
             response.status(403).send({
                 "Status": "Failure",
                 "response": "User Not Exist"
             })
 
         } else {
             const otp = await crypto.randomInt(1000, 10000).toString(); // Generate a 4-digit OTP 
             const mailOptions = {
                 from: 'Meditrace Team <meditraceapp@gmail.com>',
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
                         "Status": 'Failure',
                         "error": error.toString(), // Sends the error message as a response
                     });
                 }
 
                 // Return the OTP and the success message in the response
                 console.log('OTP sent successfully:', info.response); // Logs success message to the console
                 return response.status(200).send({
                     "Status": 'Success',
                     "OTP": otp.toString(), // Send the OTP back in the response
                 });
             });
         
         
         
         }
 
 
       } catch (error) {
           console.error('OTP Senting Error:', error); // Logs success message to the console
           return response.status(500).send({
               "Status": 'Error',
               "response": "An Error Occured", // Send the OTP back in the response
           });
        
       }





    }



}
