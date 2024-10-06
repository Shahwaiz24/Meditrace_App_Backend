import express from "express";
import UserController from "../controller/user_controller";
import { BagController } from "../controller/bag_controller";
import { MedicationController } from "../controller/medications_controller";
import OtpController from "../controller/otp_controller";

const UserRouter = express.Router();

UserRouter.post('/signup', UserController.signup);
UserRouter.post('/change-password', UserController.changePassword)
UserRouter.post('/send-otp', OtpController.sendOtp);
UserRouter.post('/login', UserController.login);
UserRouter.put('/update-profile', UserController.updateProfile);
UserRouter.post('/addBag', BagController.addBag);
UserRouter.post("/check-user-signup",UserController.checkUser)
UserRouter.post('/add-medicine', MedicationController.addMedicine);
UserRouter.post('/add-emergencyContact', UserController.addEmergencyContact);
UserRouter.post('/delete-emergencyContact', UserController.deleteEmergencyContact);
UserRouter.post('get-user', UserController.getUser);








export default UserRouter;