import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import userModel from "../model/user_model";

class UserController {
    static async signUp(request: express.Request, response: express.Response) {

        try {
            let database: Db = await Database.getDatabase();

            let body: userModel = request.body;

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
                    'phone Number': body.phoneNumber,
                    'medical Information': body.medicalInformation,
                    'emergency Contact': body.emergency_Contact,
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
}