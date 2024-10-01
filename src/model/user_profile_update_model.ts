import { ObjectId } from "mongodb";

export interface UserProfileUpdateModel {
    ObjectId: ObjectId,
    email: string,
    firstname: string,
    lastname : string,
    phoneNumber: string,
    gender: string,
    birthDate: string,
}