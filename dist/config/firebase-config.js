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
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load environment variables from .env file
dotenv.config();
class FirebaseConfig {
    static async initializeFirebaseApp() {
        if (!admin.apps.length) { // Check if Firebase is already initialized
            const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
            if (!serviceAccountPath) {
                throw new Error("Service account path not set in environment variables");
            }
            const serviceAccount = require(path.resolve(__dirname, serviceAccountPath));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'meditrace-app-firestore.appspot.com', // Default if not set
            });
            console.log("Firebase initialized with service account from environment");
        }
        else {
            console.log("Firebase already initialized");
        }
    }
    static async getfirebaseBucket() {
        return await admin.storage().bucket();
    }
}
exports.default = FirebaseConfig;
