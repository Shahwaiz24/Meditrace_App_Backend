"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileController = void 0;
const storage_1 = require("@google-cloud/storage");
const mongodb_1 = require("mongodb");
const database_1 = __importDefault(require("../config/database"));
class UpdateProfileController {
    static async UpdateProfile(request, response) {
        try {
            let db = await database_1.default.getDatabase();
            let body = request.body;
            let userCollection = db.collection("users");
            let imageCollection = db.collection("user-images");
            let userId = new mongodb_1.ObjectId(body.userId);
            let user = await userCollection.findOne({ _id: userId });
            if (!user) {
                return response.status(404).send({
                    'Status': 'Failure',
                    'response': 'User not found',
                });
            }
            else {
                let imageUrl = "";
                const storage = new storage_1.Storage();
                const bucket = storage.bucket('gs://meditrace-app-firestore.appspot.com');
                const uploadImage = async (filePath, fileName) => {
                    let contentType;
                    if (fileName.endsWith('.png')) {
                        contentType = 'image/png';
                    }
                    else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                        contentType = 'image/jpeg';
                    }
                    else {
                        throw new Error('Unsupported file type. Only PNG and JPEG images are allowed.');
                    }
                    await bucket.upload(filePath, {
                        destination: fileName,
                        metadata: {
                            contentType: contentType
                        },
                    });
                    const file = bucket.file(fileName);
                    imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                };
                let insertingImageBody = {
                    "user-image": imageUrl,
                    "user-Id": body.userId.toString()
                };
                let imageResponse = await imageCollection.insertOne(insertingImageBody);
                let imageid = imageResponse.insertedId.toString();
                await userCollection.updateOne({ _id: userId }, { $set: {
                        "firstname": body.userfirstName.toString(),
                        "lastname": body.userlastName.toString(),
                        "image-id": imageid.toString(),
                        "email": body.useremail.toString(),
                        "birthDate": body.userdateOfbirth.toString(),
                        "phone_number": body.usernumber.toString()
                    } });
                response.status(200).send({
                    "Status": "Success",
                    "response": "Successfully Updated"
                });
            }
        }
        catch (error) {
            console.error(error);
            return response.status(500).send({
                "Status": "Failure",
                "response": `Internal server error ${error}`
            });
        }
    }
}
exports.UpdateProfileController = UpdateProfileController;
