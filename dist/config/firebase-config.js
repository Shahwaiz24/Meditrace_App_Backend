"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const app_1 = require("firebase/app");
class FirebaseConfig {
    static initializeFirebaseApp() {
        const firebaseConfig = {
            apiKey: "AIzaSyDx6VoU8meZG5O4VkjL4AC4CS_ggbveMck",
            authDomain: "meditrace-app-firestore.firebaseapp.com",
            projectId: "meditrace-app-firestore",
            storageBucket: "meditrace-app-firestore.appspot.com",
            messagingSenderId: "768257456489",
            appId: "1:768257456489:web:e756762c46e26f9051a5f8"
        };
        const app = (0, app_1.initializeApp)(firebaseConfig);
        console.log("Firebase initialized successfully.");
    }
    static async getfirebaseBucket() {
        return await admin.storage().bucket();
    }
}
exports.default = FirebaseConfig;
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
