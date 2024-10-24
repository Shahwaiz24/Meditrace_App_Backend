import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { Storage } from "@google-cloud/storage";
import express from "express";
import { Db, ObjectId } from "mongodb";
import Database from "../config/database";
import UpdateProfileModel from '../model/update-profile';
import FirebaseConfig from '../config/firebase-config';

export class UpdateProfileController {
  static async UpdateProfile(request: express.Request, response: express.Response) {
    try {
      await FirebaseConfig.initializeFirebaseApp();
      const db: Db = await Database.getDatabase();
      const body: UpdateProfileModel = request.body;
      const userCollection = db.collection("users");
      const imageCollection = db.collection("user-images");

      // Find user by ID
      const user = await userCollection.findOne({ _id: new ObjectId(body.userId) });
      if (!user) {
    response.status(404).send({
          Status: "Failure",
          response: "User not found",
        });
      }

      let imageUrl: string = "";

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
        const bucket = await FirebaseConfig.getfirebaseBucket();

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
      await userCollection.updateOne(
        { _id: new ObjectId(body.userId) },
        {
          $set: {
            firstname: body.userfirstName,
            lastname: body.userlastName,
            "image-id": imageid,
            email: body.useremail,
            birthDate: body.userdateOfbirth,
            phone_number: body.usernumber,
          },
        }
      );

      // Send success response
   response.status(200).send({
        Status: "Success",
        response: "Successfully Updated",
      });
    } catch (error) {
      console.error(error);
 response.status(500).send({
        Status: "Failure",
        response: `Internal server error: ${error}`,
      });
    }
  }
}
