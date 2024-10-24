import * as admin from 'firebase-admin';
import * as path from 'path';
import { initializeApp } from "firebase/app";
import { NextFunction } from 'express';


export default class FirebaseConfig {
  static initializeFirebaseApp() {
    const firebaseConfig = {
      apiKey: "AIzaSyDx6VoU8meZG5O4VkjL4AC4CS_ggbveMck",
      authDomain: "meditrace-app-firestore.firebaseapp.com",
      projectId: "meditrace-app-firestore",
      storageBucket: "meditrace-app-firestore.appspot.com",
      messagingSenderId: "768257456489",
      appId: "1:768257456489:web:e756762c46e26f9051a5f8"
    };
  
    
      const app = initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully.");

   
  }
  
  static async getfirebaseBucket() {
    return await admin.storage().bucket();
  }
}
  // try {
      
    //   if (!admin.apps.length) {
    //     const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;  
  
    //     const serviceAccount = require(path.resolve(__dirname, serviceAccountPath!));
  
    //     admin.initializeApp({
    //       credential: admin.credential.cert(serviceAccount),
    //       storageBucket: 'meditrace-app-firestore.appspot.com',
    //     });
  
    //     console.log("Firebase initialized with service account from:", serviceAccountPath);
    //   } else {
    //     console.log("Firebase already initialized");
    //   }
    // } catch (error) {
    //   throw new Error(`Error while Initialize ${error}`);
    // }