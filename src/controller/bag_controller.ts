import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import { BagModel } from "../model/bag_model";

interface BagDetail {
    bagname: string;
}

export class BagController {
    static async addBag(request: express.Request, response: express.Response) {
        try {
            let db: Db = await Database.getDatabase();
            let body: BagModel = request.body;

            let userId = new ObjectId(body.userid); // Assuming userId is passed in the request body.
            let collection = db.collection('users');

            // Find the user by their ObjectId
            let user = await collection.findOne({ _id: userId });

            if (!user) {
                response.status(403).send({
                    "Status": "Failure",
                    "response": "User Not Exist"
                })
            }
            else {

                  
                    await collection.updateOne(
                        { "_id": userId },
                        {
                            $inc: { "Number Of Bag": 1 }
                        }
                    );

                    // Fetch the updated user to return
                    let updatedUser = await collection.findOne({ _id: userId });

                    return response.status(200).send({
                        'Status': 'Success',
                        'response': 'Bag added successfully',
                    });
                }



        } catch (error) {
            console.error("Add Bag Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
