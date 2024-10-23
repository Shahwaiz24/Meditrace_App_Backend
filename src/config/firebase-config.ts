import * as admin from 'firebase-admin';
import path from 'path';

export default class FirebaseConfig {
  static async initializeFirebaseApp() {
    if (!admin.apps.length) { // Check if Firebase is already initialized
      const serviceAccount = require(path.resolve(__dirname, '../Firebase-Service-File/meditrace-app-firestore-firebase-adminsdk-c3odt-aac25b3ea5.json'));
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
