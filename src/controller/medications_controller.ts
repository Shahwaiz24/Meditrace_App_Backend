import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import { MedicationModel } from "../model/medication_model";

export class MedicationController {
    static async addMedicine(request: express.Request, response: express.Response) {
        try {
            let db: Db = await Database.getDatabase();
            let body: MedicationModel = request.body;

            let userId = new ObjectId(body.userId); // Assuming userId is passed in the request body
            let collection = db.collection('users');

            // Fetch the user and their BagsDetails
            let user = await collection.findOne({ _id: userId });

            if (!user) {
                return response.status(404).send({
                    'Status': 'Failure',
                    'response': 'User not found',
                });
            }
            else {
                let medicines = body.medicine;
                await collection.updateOne(
                    { _id: userId },
                    { $set: { "medicines": medicines } }
                );



             
               
            }

           

        } catch (error) {
            console.error("Add Medication Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
