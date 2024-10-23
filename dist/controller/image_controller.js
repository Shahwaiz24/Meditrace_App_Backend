"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const crypto = __importStar(require("crypto"));
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
            let user = await userCollection.find({ _id: new mongodb_1.ObjectId(body.userId) }).toArray();
            if (user.length !== 0) {
                let imageUrl = "";
                // Check if Base64 image is present in the request body
                if (body.image) {
                    // Remove the Base64 prefix (if present)
                    const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
                    // Convert Base64 string to Buffer
                    const buffer = Buffer.from(base64Data, 'base64');
                    // Generate a random file name for the image
                    const fileName = crypto.randomBytes(16).toString('hex') + '.jpg'; // Change extension based on image type
                    // Create a temporary file path to save the image before uploading
                    const tempFilePath = path.join(os.tmpdir(), fileName);
                    // Write the buffer to a temporary file
                    fs.writeFileSync(tempFilePath, buffer);
                    // Upload the temporary file to Firebase Cloud Storage
                    const storage = new storage_1.Storage();
                    const bucket = storage.bucket('gs://meditrace-app-firestore.appspot.com');
                    await bucket.upload(tempFilePath, {
                        destination: fileName,
                        metadata: {
                            contentType: 'image/jpeg', // Adjust this based on the file type (e.g., png)
                        },
                    });
                    // Get the public URL of the uploaded file
                    const file = bucket.file(fileName);
                    imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                    // Delete the temporary file after upload
                    fs.unlinkSync(tempFilePath);
                }
                // Save the image URL and other details to MongoDB
                let insertingImageBody = {
                    "user-image": imageUrl,
                    "user-Id": body.userId.toString(),
                };
                let imageResponse = await imageCollection.insertOne(insertingImageBody);
                let imageid = imageResponse.insertedId.toString();
                await userCollection.updateOne({ _id: new mongodb_1.ObjectId(body.userId) }, {
                    $set: {
                        firstname: body.userfirstName.toString(),
                        lastname: body.userlastName.toString(),
                        "image-id": imageid.toString(),
                        email: body.useremail.toString(),
                        birthDate: body.userdateOfbirth.toString(),
                        phone_number: body.usernumber.toString(),
                    },
                });
                response.status(200).send({
                    Status: "Success",
                    response: "Successfully Updated",
                });
            }
            else {
                return response.status(404).send({
                    Status: "Failure",
                    response: "User not found",
                });
            }
        }
        catch (error) {
            console.error(error);
            return response.status(500).send({
                Status: "Failure",
                response: `Internal server error ${error}`,
            });
        }
    }
}
exports.UpdateProfileController = UpdateProfileController;
