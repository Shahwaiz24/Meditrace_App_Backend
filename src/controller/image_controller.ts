import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { Storage } from "@google-cloud/storage";
import express from "express";
import { Db, ObjectId } from "mongodb";
import Database from "../config/database";
import UpdateProfileModel from '../model/update-profile';

export class UpdateProfileController {
  static async UpdateProfile(request: express.Request, response: express.Response) {
    try {
      let db: Db = await Database.getDatabase();
      let body: UpdateProfileModel = request.body;
      let userCollection = db.collection("users");
      let imageCollection = db.collection("user-images");
      let user = await userCollection.find({ _id: new ObjectId(body.userId) }).toArray();

      if (user.length !== 0) {
        let imageUrl: string = "";

        // Check if Base64 image is present in the request body
        if (body.image) {
          // Remove the Base64 prefix (if present)
          const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");

          const buffer = Buffer.from(base64Data, 'base64');

          const fileName = crypto.randomBytes(16).toString('hex') + '.jpg'; // Change extension based on image type

          // Create a temporary file path to save the image before uploading
          const tempFilePath = path.join(os.tmpdir(), fileName);

          // Write the buffer to a temporary file
          fs.writeFileSync(tempFilePath, buffer);

          // Upload the temporary file to Firebase Cloud Storage
          const storage = new Storage({
            projectId: "meditrace-app-firestore",
            keyFilename: path.resolve(__dirname, '../admin-sdk.json')
          });
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

        await userCollection.updateOne(
          { _id: new ObjectId(body.userId) },
          {
            $set: {
              firstname: body.userfirstName.toString(),
              lastname: body.userlastName.toString(),
              "image-id": imageid.toString(),
              email: body.useremail.toString(),
              birthDate: body.userdateOfbirth.toString(),
              phone_number: body.usernumber.toString(),
            },
          }
        );

        response.status(200).send({
          Status: "Success",
          response: "Successfully Updated",
        });
      } else {
        return response.status(404).send({
          Status: "Failure",
          response: "User not found",
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        Status: "Failure",
        response: `Internal server error ${error}`,
      });
    }
  }
}
