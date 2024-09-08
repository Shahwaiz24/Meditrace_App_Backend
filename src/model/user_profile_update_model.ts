import { ObjectId } from "mongodb";

export interface UserProfileUpdateModel {
    ObjectId: ObjectId,
    email: string,
    fullname: string,
    phoneNumber: string,
    gender: string,
    birthDate: string,
}