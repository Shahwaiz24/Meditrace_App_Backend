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
const mongodb_1 = require("mongodb");
const database_1 = __importDefault(require("../config/database"));
const firebase_config_1 = __importDefault(require("../config/firebase-config"));
class UpdateProfileController {
    static async UpdateProfile(request, response) {
        try {
            await firebase_config_1.default.initializeFirebaseApp();
            const db = await database_1.default.getDatabase();
            const body = request.body;
            const userCollection = db.collection("users");
            const imageCollection = db.collection("user-images");
            // Find user by ID
            const user = await userCollection.findOne({ _id: new mongodb_1.ObjectId(body.userId) });
            if (!user) {
                response.status(404).send({
                    Status: "Failure",
                    response: "User not found",
                });
            }
            let imageUrl = "";
            // Check if Base64 image is present in the request body
            if (body.image) {
                // Process Base64 image
                const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');
                const fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
                const tempFilePath = path.join(os.tmpdir(), fileName);
                // Write the buffer to a temporary file
                await fs.promises.writeFile(tempFilePath, buffer);
                // Get the Firebase bucket
                const bucket = await firebase_config_1.default.getfirebaseBucket();
                // Upload the image to Firebase Storage
                await bucket.upload(tempFilePath, {
                    destination: fileName,
                    metadata: {
                        contentType: 'image/jpeg',
                    },
                });
                // Generate the public URL for the uploaded image
                imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                // Delete the temporary file
                await fs.promises.unlink(tempFilePath);
            }
            // Prepare image data for MongoDB
            const insertingImageBody = {
                "user-image": imageUrl,
                "user-Id": body.userId.toString(),
            };
            // Insert image data into the user-images collection
            const imageResponse = await imageCollection.insertOne(insertingImageBody);
            const imageid = imageResponse.insertedId.toString();
            // Update user profile with new details
            await userCollection.updateOne({ _id: new mongodb_1.ObjectId(body.userId) }, {
                $set: {
                    firstname: body.userfirstName,
                    lastname: body.userlastName,
                    "image-id": imageid,
                    email: body.useremail,
                    birthDate: body.userdateOfbirth,
                    phone_number: body.usernumber,
                },
            });
            // Send success response
            response.status(200).send({
                Status: "Success",
                response: "Successfully Updated",
            });
        }
        catch (error) {
            console.error(error);
            response.status(500).send({
                Status: "Failure",
                response: `Internal server error: ${error}`,
            });
        }
    }
}
exports.UpdateProfileController = UpdateProfileController;
