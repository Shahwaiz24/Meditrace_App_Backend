import express from "express";
import Database from "../config/database";
import { Db, ObjectId } from "mongodb";
import { MedicationModel } from "../model/medication_model";

export class MedicationController {
    static async addMedication(request: express.Request, response: express.Response) {
        try {
            let db: Db = await Database.getDatabase();
            let body: MedicationModel = request.body;

            let userId = new ObjectId(body.userid); // Assuming userId is passed in the request body
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
                // Retrieve the BagsDetails array
                let bagsDetails = user.BagsDetails;

                // Find the specific bag within BagsDetails
                let bagIndex = bagsDetails.findIndex((b: any) => b.bagname === body.bagname);

                if (bagIndex === -1) {
                    return response.status(404).send({
                        'Status': 'Failure',
                        'response': 'Bag not found',
                    });
                }
                else {
                    // Prepare the new medication
                    let newMedication = {
                        MedicationName: body.medication.MedicationName,
                        MedicationStrength: body.medication.MedicationStrength,
                        StrengthUnit: body.medication.StrengthUnit,
                        Frequency: body.medication.Frequency,
                        Time: body.medication.Time
                    };

                    // Check if a medication with the same name already exists in the bag
                    let existingMedication = bagsDetails[bagIndex].medications.some((med: any) => med.MedicationName === newMedication.MedicationName);

                    if (existingMedication) {
                        return response.status(409).send({
                            'Status': 'Failure',
                            'response': 'Medication Already Exist',
                        });
                    }
                    else {
                        // Add the new medication to the existing list
                        let updatedBagsDetails = [...bagsDetails];
                        updatedBagsDetails[bagIndex].medications = [
                            ...(updatedBagsDetails[bagIndex].medications || []),
                            newMedication
                        ];

                        // Update the document in MongoDB
                        await collection.updateOne(
                            { _id: userId },
                            {
                                $set: {
                                    "BagsDetails": updatedBagsDetails
                                }
                            }
                        );

                        // Fetch the updated user to return
                        let updatedUser = await collection.findOne({ _id: userId });

                        return response.status(200).send({
                            'Status': 'Success',
                            'response': 'Medication added successfully',
                            'user': updatedUser
                        });
                    }

                   
                }

               
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
