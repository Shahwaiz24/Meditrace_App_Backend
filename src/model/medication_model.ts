// model/medication_model.ts

import { ObjectId } from "mongodb";

type FrequencyDetails =
    | {

        frequency: 'as needed';
    } | {

        frequency: 'Everyday';
    }
    | {
        frequency: string[]; // Use string[] if specificDays is an array of strings, adjust if needed
    };


export interface MedicationModel {
    userId: string;
    medicine: [];
}
