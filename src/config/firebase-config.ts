import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

export default class FirebaseConfig {
  static async initializeFirebaseApp() {
    if (!admin.apps.length) { // Check if Firebase is already initialized
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!serviceAccountPath) {
        throw new Error("Service account path not set in environment variables");
      }

      const serviceAccount = require(path.resolve(__dirname, serviceAccountPath));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'gs://meditrace-app-firestore.appspot.com', // Default if not set
      });

      console.log("Firebase initialized with service account from environment");
    } else {
      console.log("Firebase already initialized");
    }
  }
}
