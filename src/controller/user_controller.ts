import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import UserSignUpModel from "../model/user_signup_model";
import { UserLoginModel } from "../model/user_login_model";

class UserController {
    static async signup(request: express.Request, response: express.Response) {

        try {
            let database: Db = await Database.getDatabase();
            console.log("Database connection successful");



            let body: UserSignUpModel = request.body;

            let checking = {
                email: body.email
            }

            let collection = database.collection('users');
            let responseCheck = await collection.find(checking).toArray();

            if (responseCheck.length != 0) {
                response.status(403).send({
                    'Status': 'Failure',
                    'response': 'Email Already Exist'
                })
            }
            else {
                let insertingBody = {
                    'fullname': body.fullname.toString(),
                    'email': body.email.toString(),
                    'password': body.password.toString(),
                    'phone Number': body.phoneNumber.toString(),
                    'Bags': {
                        'Number Of Bag': 0,
                        'bag items': {}
                    },
                    'medical Information': {
                        "Known_Allergies": body.medicalInformation.Known_Allergies.toString(),
                        "Chronic_Conditions": body.medicalInformation.Chronic_Conditions.toString(),
                        "Medications": body.medicalInformation.Medications.toString(),
                    },
                    'emergency Contact': {
                        "contactName": body.emergency_Contact.contactName.toString(),
                        "contactNumber": body.emergency_Contact.contactNumber.toString()
                    },
                };
                let responsedata = await collection.insertOne(insertingBody);
                let User_Id = responsedata.insertedId;
                let userData = await collection.find({ "_id": new ObjectId(User_Id) }).toArray();
                response.status(200).send({
                    'Status': 'Success',
                    'response': 'User Signuped',
                    'user Data': userData,
                })
            }
        } catch (error) {
            console.error("Signup Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                "status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : "Unknown error"
            });

        }



    }
    static async login(request: express.Request, response: express.Response) {
        try {
            let database: Db = await Database.getDatabase();
            let body: UserLoginModel = request.body;

            let checking = {
                email: body.email,
                password: body.password
            }

            let collection = database.collection('users');
            let responseCheck = await collection.find(checking).toArray();

            if (responseCheck.length !== 0) {
                return response.status(200).send({
                    "status": "Success",
                    "response": 'SuccessFuly Logined',
                    'User Data' : responseCheck
                });
            }
            else {
                response.status(403).send({
                    "status": "Failure",
                    "response": "Email Not Exist"
                });
            }



        } catch (error) {
            console.error("Login Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                "status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : "Unknown error"
            });

        }
    }

}

export default UserController;