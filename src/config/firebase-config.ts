
export default class FirebaseConfig {

    static async initializeFirebaseApp(){
        const serviceAccount = require('C:\Users\Leo\Desktop\Flutter_Projects\Meditrace_App_Backend\Firebase Service File\meditrace-app-firestore-firebase-adminsdk-c3odt-aac25b3ea5.json');
        const admin = require('firebase-admin');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: 'gs://meditrace-app-firestore.appspot.com'
        });
    }
}