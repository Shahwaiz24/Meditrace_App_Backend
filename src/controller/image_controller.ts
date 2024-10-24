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

          const fileName = crypto.randomBytes(16).toString('hex') + '.jpg'; 

          const tempFilePath = path.join(os.tmpdir(), fileName);

          fs.writeFileSync(tempFilePath, buffer);

          const storage = new Storage({
            projectId: "meditrace-app-firestore",
            keyFilename : process.env.GOOGLE_APPLICATION_CREDENTIALS,
          });
          const bucket = storage.bucket('meditrace-app-firestore.appspot.com');
          await bucket.upload(tempFilePath, {
            destination: fileName,
            metadata: {
              contentType: 'image/jpeg', 
            },
          });

          const file = bucket.file(fileName);
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

          fs.unlinkSync(tempFilePath);
        }

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
