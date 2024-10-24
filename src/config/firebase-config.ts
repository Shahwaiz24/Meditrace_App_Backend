import * as admin from 'firebase-admin';
import * as path from 'path';
import { initializeApp } from "firebase/app";
import { NextFunction } from 'express';


export default class FirebaseConfig {
  static initializeFirebaseApp() {
    try {
      
      if (!admin.apps.length) {
  
        const serviceAccount = require("./serviceAccountKey.json");
  
        admin.initializeApp({
          credential: admin.credential.cert(path.resolve("./serviceAccountKey.json")),
          storageBucket: 'meditrace-app-firestore.appspot.com',
        });
  
      } else {
        console.log("Firebase already initialized");
      }
    } catch (error) {
      throw new Error(`Error while Initialize ${error}`);
    }

   
  }
  
  static async getfirebaseBucket() {
    return await admin.storage().bucket();
  }
}
 