import express from "express";
import UserController from "../controller/user_controller";

const UserRouter = express.Router();

UserRouter.post('/signup', UserController.signUp);

export default UserRouter;