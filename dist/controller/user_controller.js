"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const mongodb_1 = require("mongodb");
class UserController {
    static async signup(request, response) {
        try {
            let database = await database_1.default.getDatabase();
            let body = request.body;
            let checking = {
                email: body.email
            };
            let collection = database.collection('users');
            let responseCheck = await collection.find(checking).toArray();
            if (responseCheck.length != 0) {
                response.status(403).send({
                    'Status': 'Failure',
                    'response': 'Email Already Exist'
                });
            }
            else {
                let insertingBody = {
                    'firstname': body.firstname.toString(),
                    'lastname': body.lastname.toString(),
                    'email': body.email.toString(),
                    'password': body.password.toString(),
                    'phone_number': body.phoneNumber.toString(),
                    'gender': body.gender.toString(),
                    'birthDate': body.dateofbirth.toString(),
                    'bags': 0,
                    'medicines': [],
                    'medical Information': {
                        "Known_Allergies": body.medicalInformation.known_Allergies.toString(),
                        "Chronic_Conditions": body.medicalInformation.chronic_Conditions.toString(),
                        "Height": body.medicalInformation.height.toString(),
                        "Weight": body.medicalInformation.weight.toString(),
                        "Blood_Group": body.medicalInformation.bloodGroup.toString(),
                    },
                    'emergencyContacts': body.emergency_Contact
                };
                let responsedata = await collection.insertOne(insertingBody);
                let User_Id = responsedata.insertedId;
                response.status(200).send({
                    'Status': 'Success',
                    'response': 'User Signuped',
                    'Id': User_Id,
                });
            }
        }
        catch (error) {
            console.error("Signup Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    static async login(request, response) {
        try {
            let database = await database_1.default.getDatabase();
            let body = request.body;
            let checking = {
                email: body.email,
                password: body.password
            };
            let collection = database.collection('users');
            let responseCheck = await collection.find(checking).toArray();
            if (responseCheck.length != 0) {
                return response.status(200).send({
                    "Status": "Success",
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
        }
        catch (error) {
            console.error("Login Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    static async updateProfile(request, response) {
        try {
            let database = await database_1.default.getDatabase();
            let body = request.body;
            // Initialize ObjectId once
            let objectId = new mongodb_1.ObjectId(body.ObjectId);
            let collection = database.collection('users');
            // Check if user exists
            let responseCheck = await collection.find({ "_id": objectId }).toArray();
            if (responseCheck.length != 0) {
                // Prepare the fields to update
                let updateProfile = {
                    'firstname': body.firstname,
                    'lastname': body.lastname,
                    'email': body.email,
                    'phone Number': body.phoneNumber,
                    'gender': body.gender,
                    'birthDate': body.birthDate
                };
                // Correct usage of updateOne with $set
                let updated = await collection.updateOne({ "_id": objectId }, { $set: updateProfile });
                if (updated.modifiedCount > 0) {
                    response.status(200).send({
                        'Status': 'Success',
                        'response': 'Profile updated successfully'
                    });
                }
                else {
                    response.status(400).send({
                        'Status': 'Failure',
                        'response': 'Profile update failed'
                    });
                }
            }
            else {
                response.status(404).send({
                    'Status': 'Failure',
                    'response': 'User not found'
                });
            }
        }
        catch (error) {
            console.error("Update Profile Error:", error instanceof Error ? error.message : error);
            response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async addEmergencyContact(request, response) {
        try {
            let database = await database_1.default.getDatabase();
            let body = request.body;
            let collection = database.collection('users');
            // Find user by ID
            let user = await collection.findOne({ "_id": new mongodb_1.ObjectId(body.userId) });
            if (!user) {
                return response.status(403).send({
                    "Status": "Failure",
                    "response": "User Does Not Exist"
                });
            }
            else {
                // Initialize emergencyContacts if it doesn't exist
                let emergencyContacts = user.emergencyContacts || [];
                // Check if a contact with the same contactNumber already exists
                let contactExists = emergencyContacts.some((contact) => contact.contactNumber === body.contactNumber.toString());
                if (contactExists) {
                    return response.status(400).send({
                        "Status": "Failure",
                        "response": "Contact Already Exists"
                    });
                }
                else {
                    // Create the new contact object
                    let newContact = {
                        "contactName": body.contactname.toString(),
                        "contactNumber": body.contactNumber.toString()
                    };
                    // Add the new contact to the array
                    emergencyContacts.push(newContact);
                    // Update the user document with the new emergencyContacts array
                    await collection.updateOne({ "_id": new mongodb_1.ObjectId(body.userId) }, {
                        $set: {
                            "emergencyContacts": emergencyContacts
                        }
                    });
                    // Fetch the updated user
                    let updatedUser = await collection.findOne({ "_id": new mongodb_1.ObjectId(body.userId) });
                    return response.status(200).send({
                        "Status": "Success",
                        "response": "Emergency contact added successfully",
                    });
                }
            }
        }
        catch (error) {
            console.error("Add Emergency Contact Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async deleteEmergencyContact(request, response) {
        try {
            let database = await database_1.default.getDatabase();
            let body = request.body;
            let collection = database.collection('users');
            // Find user by ID
            let user = await collection.findOne({ "_id": new mongodb_1.ObjectId(body.userId) });
            if (!user) {
                return response.status(403).send({
                    "Status": "Failure",
                    "response": "User Does Not Exist"
                });
            }
            else {
                let emergencyContacts = user.emergencyContacts || [];
                // Find the index of the contact to delete
                const contactIndex = emergencyContacts.findIndex((contact) => contact.contactNumber === body.contactNumber);
                // If contact is found, remove it
                if (contactIndex !== -1) {
                    emergencyContacts.splice(contactIndex, 1); // Remove the contact from the array
                    // Update the user's emergencyContacts list with the updated array
                    await collection.updateOne({ "_id": new mongodb_1.ObjectId(body.userId) }, {
                        $set: {
                            "emergencyContacts": emergencyContacts
                        }
                    });
                    // Send the updated emergency contacts back in the response
                    let updatedUser = await collection.findOne({ "_id": new mongodb_1.ObjectId(body.userId) });
                    return response.status(200).send({
                        "Status": "Success",
                        "response": "Emergency contact deleted successfully",
                    });
                }
                else {
                    // If the contact is not found
                    return response.status(404).send({
                        "Status": "Failure",
                        "response": "Emergency contact not found"
                    });
                }
            }
        }
        catch (error) {
            console.error("Delete Emergency Contact Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                "Status": "Error",
                "response": "An unexpected error occurred.",
                "details": error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    static async checkUser(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let body = request.body;
            let collection = db.collection("users");
            let check = {
                email: body.email
            };
            let finding = await collection.find(check).toArray();
            if (finding.length != 0) {
                response.status(200).send({
                    "Status": "Success",
                    "response": "User Already Exist"
                });
            }
            else {
                response.status(403).send({
                    "Status": "Failure",
                    "response": "User not Exist"
                });
            }
        }
        catch (error) {
            console.error("Error in checkUser:", error);
            return response.status(500).send({
                "Status": "Error",
                "response": `${error}`
            });
        }
    }
    static async changePassword(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let collection = db.collection("users");
            let body = request.body;
            let id = new mongodb_1.ObjectId(body.userId);
            // Check if the user exists in the database
            let check = await collection.find({ "_id": id }).toArray();
            if (check.length != 0) {
                // Only update the password
                let updateData = {
                    $set: {
                        'password': body.password.toString()
                    }
                };
                // Update the user's password in the database
                await collection.updateOne({ "_id": id }, updateData);
                return response.status(200).send({
                    "Status": "Success",
                    "response": "Password updated successfully"
                });
            }
            else {
                // If the user is not found, return an error response
                return response.status(404).send({
                    "Status": "Failure",
                    "response": "User not found"
                });
            }
        }
        catch (error) {
            console.error("Error in changePassword:", error);
            return response.status(500).send({
                "Status": "Error",
                "response": "Internal Server Error"
            });
        }
    }
    static async getUser(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let collection = db.collection("users");
            let body = request.body;
            let check = await collection.find({ "_id": new mongodb_1.ObjectId(body.user_Id) }).toArray();
            if (check.length != 0) {
                response.status(200).send({ "Status": "Success", "response": check[0] });
            }
            else {
                response.status(403).send({ "Status": "Failure", "response": "User Not Exist" });
            }
        }
        catch (error) {
            response.status(500).send({ "Status": "Error", "response": "Error Fetching User" });
        }
    }
}
exports.default = UserController;
