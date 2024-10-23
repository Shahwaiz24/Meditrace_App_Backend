import * as admin from 'firebase-admin';

export default class FirebaseConfig {
  static async initializeFirebaseApp() {
    if (!admin.apps.length) { // Check if Firebase is already initialized
      const path = require('path');
      const serviceAccount = require(path.resolve(__dirname, '../admin-sdk.json'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://meditrace-app-firestore.appspot.com',
      });
      console.log("Firebase initialized");
    } else {
      console.log("Firebase already initialized");
    }
  }
}
