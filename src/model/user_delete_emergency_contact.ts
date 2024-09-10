import { ObjectId } from "mongodb";

export interface DeleteEmergencyContact {

    userId: ObjectId,
    contactNumber : string,

}