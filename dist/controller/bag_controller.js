"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagController = void 0;
const database_1 = __importDefault(require("../config/database"));
const mongodb_1 = require("mongodb");
class BagController {
    static async addBag(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let body = request.body;
            let userId = new mongodb_1.ObjectId(body.userid);
            let collection = db.collection('users');
            // Find the user by their ObjectId
            let user = await collection.findOne({ _id: userId });
            if (!user) {
                response.status(403).send({
                    "Status": "Failure",
                    "response": "User Not Exist"
                });
            }
            else {
                await collection.updateOne({ "_id": userId }, {
                    $inc: { "bags": 1 }
                });
                // Fetch the updated user to return
                return response.status(200).send({
                    'Status': 'Success',
                    'response': 'Bag added successfully',
                });
            }
        }
        catch (error) {
            console.error("Add Bag Error:", error instanceof Error ? error.message : error);
            return response.status(500).send({
                'Status': 'Error',
                'response': 'An unexpected error occurred.',
                'details': error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.BagController = BagController;
