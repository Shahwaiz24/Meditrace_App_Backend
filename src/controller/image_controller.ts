import express from "express";
import { Storage } from "@google-cloud/storage";
import UpdateProfileModel from "../model/update-profile";
import { Db, ObjectId } from "mongodb";
import Database from "../config/database";

export class UpdateProfileController {
    
    static async UpdateProfile(request: express.Request, response: express.Response) {
        try {
            let db: Db = await Database.getDatabase();
            let body : UpdateProfileModel = request.body;
            let userCollection = db.collection("users");
            let imageCollection = db.collection("user-images");
            let userId = new ObjectId(body.userId);
            let user = await userCollection.findOne({ _id: userId });
            if (!user) {
                return response.status(404).send({
                    'Status': 'Failure',
                    'response': 'User not found',
                });
            }
            else{
                let imageUrl : string = "";
                const storage = new Storage();
                const bucket = storage.bucket('gs://meditrace-app-firestore.appspot.com');
                const uploadImage = async (filePath: string, fileName: string) => {
                    let contentType: string;

                    if (fileName.endsWith('.png')) {
                      contentType = 'image/png';
                    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                      contentType = 'image/jpeg';
                    } else {
                      throw new Error('Unsupported file type. Only PNG and JPEG images are allowed.');
                    }
                    await bucket.upload(filePath, {
                      destination: fileName,
                      metadata: {
                        contentType: contentType 
                      },
                    },
            
                   
                );
                const file = bucket.file(fileName);
                 imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                }

                let insertingImageBody  = {
                  "user-image" : imageUrl,
                  "user-Id" : body.userId.toString()                };
                let imageResponse = await imageCollection.insertOne(
                  insertingImageBody
                );
                let imageid = imageResponse.insertedId.toString();

               await userCollection.updateOne({_id : userId},{$set: {
                  "firstname" : body.userfirstName.toString(),
                  "lastname" : body.userlastName.toString(),
                  "image-id" : imageid.toString(),
                  "email" : body.useremail.toString(),
                  "birthDate" : body.userdateOfbirth.toString(),
                  "phone_number" : body.usernumber.toString()
                }});
                response.status(200).send({
                  "Status" : "Success",
                  "response" : "Successfully Updated"
                });


            }


          

          
            
        } catch (error) {
            console.error(error);
            return response.status(500).send({
                "Status": "Failure",
                "response": `Internal server error ${error}`
            });
        }
    }
}
