// model/medication_model.ts

type FrequencyDetails =
    | {
        frequency: string;
        intervalDays: number;
    }
    | {
        frequency: string;
        specificDays: string[]; // Use string[] if specificDays is an array of strings, adjust if needed
    };


export interface MedicationModel {
    userid: string;
    bagname: string;
    medication: {
        MedicationName: string;
        MedicationStrength: string;
        StrengthUnit: string,
        Frequency: FrequencyDetails,
        Time : string,
    };
}
