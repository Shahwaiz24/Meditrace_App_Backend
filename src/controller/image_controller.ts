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
      let db: Db = await Database.getDatabase();
      let body: UpdateProfileModel = request.body;
      let userCollection = db.collection("users");
      let imageCollection = db.collection("user-images");
      

      // Find user by ID
      let user = await userCollection.findOne({ _id: new ObjectId(body.userId) });

      if (!user) {
        return response.status(404).send({
          Status: "Failure",
          response: "User not found",
        });
      }

      let imageUrl: string = "";

      // Check if Base64 image is present in the request body
      if (body.image) {
        // Remove the Base64 prefix (if present)
        const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = crypto.randomBytes(16).toString('hex') + '.jpg'; 
        const tempFilePath = path.join(os.tmpdir(), fileName);

        // Write the buffer to a temporary file
        fs.writeFileSync(tempFilePath, buffer);

        // Get the Firebase bucket
        await FirebaseConfig.initializeFirebaseApp();
        let bucket = await FirebaseConfig.getfirebaseBucket();

        // Upload the image to Firebase Storage
        await bucket.upload(tempFilePath, {
          destination: fileName,
          metadata: {
            contentType: 'image/jpeg', 
          },
        });

        // Generate the public URL for the uploaded image
        const file = bucket.file(fileName);
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // Delete the temporary file
        fs.unlinkSync(tempFilePath);
      }

      // Prepare image data for MongoDB
      let insertingImageBody = {
        "user-image": imageUrl,
        "user-Id": body.userId.toString(),
      };

      // Insert image data into the user-images collection
      let imageResponse = await imageCollection.insertOne(insertingImageBody);
      let imageid = imageResponse.insertedId.toString();

      // Update user profile with new details
      await userCollection.updateOne(
        { _id: new ObjectId(body.userId) },
        {
          $set: {
            firstname: body.userfirstName.toString(),
            lastname: body.userlastName.toString(),
            "image-id": imageid,
            email: body.useremail.toString(),
            birthDate: body.userdateOfbirth.toString(),
            phone_number: body.usernumber.toString(),
          },
        }
      );

      // Send success response
      return response.status(200).send({
        Status: "Success",
        response: "Successfully Updated",
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        Status: "Failure",
        response: `Internal server error: ${error}`,
      });
    }
  }
}
