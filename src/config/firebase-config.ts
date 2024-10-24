import * as admin from 'firebase-admin';
import * as path from 'path';
import { initializeApp } from "firebase/app";
import { NextFunction } from 'express';

let firebaseApp;
export default class FirebaseConfig {
  
  static async initializeFirebaseApp() {
    try {
      
      if (!admin.apps.length) {
  
  
     firebaseApp =  await admin.initializeApp({
          credential: admin.credential.cert({
            clientEmail: "firebase-adminsdk-c3odt@meditrace-app-firestore.iam.gserviceaccount.com",
            projectId: "meditrace-app-firestore",
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaijXvwg94Pskx\n/K7/s5rP7mbi7pqXFYFopaLSoIOXJCilrHqgb5zomUFYX5mEB4mxUFOa0hUDq2eA\n8hhG5busc0vQ4bPnNFe4Ow1f4yk7J5/dFyL8R+oVd6KLOtfh2A7WxvgEEPJyMMlJ\nEYfsBxb1dKOM7VIKxQWxgVnaq83nnt6gGIOdu/C9obgueZ1ehm6Gd2WWNw86Q6T9\n/oReQaqu1MpMqYIE7S5inxI266ETs8wYVM8qi+1DtiPVLF2Rcufc4uUSDAESexF+\nybsYud37a/HY4CT3Z9dmejlb+R98rHenkEyVIzmck9kfZE90yFCJABO1iiNz4FFm\niBoNEl4RAgMBAAECggEARAOkwrAuWVmNC3IdUrZmlZUYT0M8OI44XsXCFXRgT+8w\neVNjPMBP4LIlvKfQIt+nslgSFQqSALjdNyvhc1s3W/XsIB/Gekv3iv5R7MhJgkAU\nSF5VhJerGjBIFbXkD0VLZPu6n6VYl0JousVqfII+WnkJF6iakoB8A6ECwoQayp07\nORaLsm4CrV7JHL5Pf46B1vHgKKZNXdIfGFnjXOJGMohpfPH3J/pXiPxilHnNlmD8\nqnSIpc6N9pUqu1wk+pRXFYMO+9FsY/RvH1b7v4TrkQM/NvADyNb7IGhl6wnrwCOG\ns5TsDaFAPb3TYPU5Kgo9VhKGOzEzFnxPGR3DYrGNywKBgQD4up4PxVMkGAbv+Ibd\njQl4J8gcjPLF2M1p0ih8TnZRiE685FLLF4QZmwAuVuNd4ukGuQc5VT9Hj/UNitlY\ncBvN5DLkj2/fVRGjDcFm8u9xyAcmJ2/buoCO2yCSg4kUHujh2OYeXMYvwEPorQ0S\nPBQB3tcF0SvAPXrDbuGZB/g34wKBgQDg7au+YXwB9AZaJJJ1vjJo4yp5SFfY8h1A\nKrzwYwNej/1h5Czq+lHCzDPtn3OhdDJ8rtGKbrW46Pabi7lGxr3rKee3efnRQcwr\npz75tC6BL+nCjBouqAY9w6eKTHGkG2VtpGWrFB4768l6He00jtGyiWdPgCecV9WV\n1OXf9SGsewKBgQDggQE+VuuOfql0XKzOuQi9DZtQOeC/t8rhIzIr0V52hUQctzIL\n4nP38LIfIYokKjYPPV9J3qo5W7Tivlsjuj0+gCV3rAhcWxqKRFY3KDv8RYI+bAZJ\nHHQBfcROuq82HBg0EmTTLwYr/6zMDbboqJWegpcuxvhokpWGZUT3rfvb5QKBgEor\ntYWLCeRu/qU9CBrRhDf4KOpjg6xjcmfVcAZo8BR/sNNV9cXqk4mD4t/Jw8yKz5cz\n4p8ekMgP8joqogcHxFrGr8Vd8JYjd1sxxF99HhS1owTnRD78Y0p8uUOun465BgJY\nwrneYXXq875UHgNF0TppeurJXMZ+ZE0LLl5irB7/AoGALN2BYoRWK+nxj6tiXD1d\nkS6a1RFQf274kRbLNq7LSa2jGtgJHjNnKrqZaYCUVsUII7XQonH+Gsi8gxUOYQf7\n0tt1M1mIaVXI1/a2oTb5piBKFsRfh80WFK9SZzFAjwaVvvwYJoWPwDgXEg/gY/fb\nDkBev/A5pVWWTFqpgsUN7oQ=\n-----END PRIVATE KEY-----\n",
          }),
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
    return await firebaseApp!.storage().bucket();
  }
}
 