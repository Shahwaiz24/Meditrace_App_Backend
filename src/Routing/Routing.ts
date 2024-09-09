import express from "express";
import UserController from "../controller/user_controller";
import { BagController } from "../controller/bag_controller";
import { MedicationController } from "../controller/medications_controller";

const UserRouter = express.Router();

UserRouter.post('/signup', UserController.signup);
UserRouter.post('/login', UserController.login);
UserRouter.put('/updateProfile', UserController.updateProfile);
UserRouter.post('/addBag', BagController.addBag);
UserRouter.post('/addMedication', MedicationController.addMedication);






export default UserRouter;