import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import { BagModel } from "../model/bag_model";

interface BagDetail {
    bagname: string;
    medications: string[]; // Array of medications
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
                // Check if the bag already exists in BagsDetails
                let existingBag = user.BagsDetails?.find((bag: BagDetail) => bag.bagname === body.bagname);

                if (existingBag) {
                    // Bag already exists, return it
                    return response.status(409).send({
                        'Status': 'Failure',
                        'response': 'Bag already exists',
                    });
                } else {
                    // Add the new bag
                    let newBag: BagDetail = {
                        bagname: body.bagname,
                        medications: [] // Initialize with an empty array or add initial medications if any
                    };

                    // Ensure BagsDetails is initialized
                    let bagsList: BagDetail[] = user?.BagsDetails || [];
                    bagsList.push(newBag);

                    // Update the user's BagsDetails and increment the number of bags
                    await collection.updateOne(
                        { "_id": userId },
                        {
                            $set: { "BagsDetails": bagsList },
                            $inc: { "Number Of Bag": 1 }
                        }
                    );

                    // Fetch the updated user to return
                    let updatedUser = await collection.findOne({ _id: userId });

                    return response.status(200).send({
                        'Status': 'Success',
                        'response': 'Bag added successfully',
                        'user': updatedUser
                    });
                }


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
