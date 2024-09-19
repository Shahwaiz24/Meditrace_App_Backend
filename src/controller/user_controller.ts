import express from "express";
import Database from "../config/database";
import { Db, ObjectId, } from "mongodb";
import UserSignUpModel from "../model/user_signup_model";
import { UserLoginModel } from "../model/user_login_model";
import { UserProfileUpdateModel } from "../model/user_profile_update_model";
import { AddEmergencyContact } from "../model/user_add_emergency_contact_model";
import { DeleteEmergencyContact } from "../model/user_delete_emergency_contact";

class UserController {
    static async signup(request: express.Request, response: express.Response) {

        try {
            let database: Db = await Database.getDatabase();



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
                    'firstname': body.firstname.toString(),
                    'lastname' : body.lastname.toString(),
                    'email': body.email.toString(),
                    'password': body.password.toString(),
                    'phone Number': body.phoneNumber.toString(),
                    'gender': body.gender.toString(),
                    'birthDate': body.dateofbirth.toString(),
                    'Number Of Bag': 0,
                    'BagsDetails': [],
                    'medical Information': {
                        "Known_Allergies": body.medicalInformation.Known_Allergies.toString(),
                        "Chronic_Conditions": body.medicalInformation.Chronic_Conditions.toString(),
                        "Height": body.medicalInformation.Height.toString(),
                        "Weight": body.medicalInformation.Weight.toString(),
                        "Blood_Group": body.medicalInformation.bloodGroup.toString(),
                    },
                    'emergencyContacts': [
                        {
                            "contactName": body.emergency_Contact.contactName.toString(),
                            "contactNumber": body.emergency_Contact.contactNumber.toString()
                        },
                    ]
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
                    'User_Data': responseCheck
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
    static async updateProfile(request: express.Request, response: express.Response) {
        try {
            let database: Db = await Database.getDatabase();
            let body: UserProfileUpdateModel = request.body;

            // Initialize ObjectId once
            let objectId = new ObjectId(body.ObjectId);

            let collection = database.collection('users');

            // Check if user exists
            let responseCheck = await collection.find({ "_id": objectId }).toArray();

            if (responseCheck.length != 0) {
                // Prepare the fields to update
                let updateProfile = {
                    'fullname': body.fullname,
                    'email': body.email,
                    'phone Number': body.phoneNumber,
                    'gender': body.gender,
                    'birthDate': body.birthDate
                };

                // Correct usage of updateOne with $set
                let updated = await collection.updateOne(
                    { "_id": objectId },
                    { $set: updateProfile }
                );

                if (updated.modifiedCount > 0) {
                    response.status(200).send({
                        'Status': 'Success',
                        'response': 'Profile updated successfully'
                    });
                } else {
                    response.status(400).send({
                        'Status': 'Failure',
                        'response': 'Profile update failed'
                    });
                }
            } else {
                response.status(404).send({
                    'Status': 'Failure',
                    'response': 'User not found'
                });
            }
        } catch (error) {
            console.error("Update Profile Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async addEmergencyContact(request: express.Request, response: express.Response) {
        try {
            let database: Db = await Database.getDatabase();

            let body: AddEmergencyContact = request.body;

            let collection = database.collection('users');

            // Find user by ID
            let user = await collection.findOne({ "_id": new ObjectId(body.userId) });

            if (!user) {
                return response.status(403).send({
                    "Status": "Failure",
                    "response": "User Does Not Exist"
                });
            } else {
                // Initialize emergencyContacts if it doesn't exist
                let emergencyContacts = user.emergencyContacts || [];

                // Check if a contact with the same contactNumber already exists
                let contactExists = emergencyContacts.some((contact: any) => contact.contactNumber === body.contactNumber.toString());

                if (contactExists) {
                    return response.status(400).send({
                        "Status": "Failure",
                        "response": "Contact Already Exists"
                    });
                } else {
                    // Create the new contact object
                    let newContact = {
                        "contactName": body.contactname.toString(),
                        "contactNumber": body.contactNumber.toString()
                    };

                    // Add the new contact to the array
                    emergencyContacts.push(newContact);

                    // Update the user document with the new emergencyContacts array
                    await collection.updateOne(
                        { "_id": new ObjectId(body.userId) },
                        {
                            $set: {
                                "emergencyContacts": emergencyContacts
                            }
                        }
                    );

                    // Fetch the updated user
                    let updatedUser = await collection.findOne({ "_id": new ObjectId(body.userId) });

                    return response.status(200).send({
                        "Status": "Success",
                        "response": "Emergency contact added successfully",
                        "emergencyContacts": updatedUser?.emergencyContacts // Return updated contact list
                    });
                }
            }

        } catch (error) {
            console.error("Add Emergency Contact Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async deleteEmergencyContact(request: express.Request, response: express.Response) {
        try {
            let database: Db = await Database.getDatabase();

            let body: DeleteEmergencyContact = request.body;

            let collection = database.collection('users');

            // Find user by ID
            let user = await collection.findOne({ "_id": new ObjectId(body.userId) });

            if (!user) {
                return response.status(403).send({
                    "Status": "Failure",
                    "response": "User Does Not Exist"
                });
            } else {
                let emergencyContacts = user.emergencyContacts || [];

                // Find the index of the contact to delete
                const contactIndex = emergencyContacts.findIndex((contact: any) => contact.contactNumber === body.contactNumber);

                // If contact is found, remove it
                if (contactIndex !== -1) {
                    emergencyContacts.splice(contactIndex, 1); // Remove the contact from the array

                    // Update the user's emergencyContacts list with the updated array
                    await collection.updateOne(
                        { "_id": new ObjectId(body.userId) },
                        {
                            $set: {
                                "emergencyContacts": emergencyContacts
                            }
                        }
                    );

                    // Send the updated emergency contacts back in the response
                    let updatedUser = await collection.findOne({ "_id": new ObjectId(body.userId) });

                    return response.status(200).send({
                        "Status": "Success",
                        "response": "Emergency contact deleted successfully",
                        "emergencyContacts": updatedUser?.emergencyContacts
                    });
                } else {
                    // If the contact is not found
                    return response.status(404).send({
                        "Status": "Failure",
                        "response": "Emergency contact not found"
                    });
                }
            }
        } catch (error) {
            console.error("Delete Emergency Contact Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

}


export default UserController;