"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationController = void 0;
const database_1 = __importDefault(require("../config/database"));
const mongodb_1 = require("mongodb");
class MedicationController {
    static async addMedicine(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let body = request.body;
            let userId = new mongodb_1.ObjectId(body.userId); // Assuming userId is passed in the request body
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
                await collection.updateOne({ _id: userId }, { $set: { "medicines": medicines } });
                return response.status(200).send({
                    'Status': 'Success',
                    'response': 'Medicine Add Succesfully',
                });
            }
        }
        catch (error) {
            console.error("Add Medication Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.MedicationController = MedicationController;
