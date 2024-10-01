import { ObjectId } from "mongodb";

export default interface changePasswordModel {
    userId: ObjectId;
    password: string;
 };