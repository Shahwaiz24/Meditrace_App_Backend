import * as admin from 'firebase-admin';
import * as path from 'path';

export default class FirebaseConfig {
  static initializeFirebaseApp() {
 
    try {
      
      if (!admin.apps.length) {
        const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;  
  
        const serviceAccount = require(path.resolve(__dirname, serviceAccountPath!));
  
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: 'meditrace-app-firestore.appspot.com',
        });
  
        console.log("Firebase initialized with service account from:", serviceAccountPath);
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
