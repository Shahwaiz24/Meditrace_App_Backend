import { ObjectId } from "mongodb";

export interface AddEmergencyContact { 
    userId: ObjectId,
    contactname: string,
    contactNumber : number,
}