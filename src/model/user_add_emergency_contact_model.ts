import { ObjectId } from "mongodb";

export interface addEmergencyContact { 
    userId: ObjectId,
    contactname: string,
    contactNumber : number,
}