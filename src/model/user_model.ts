interface userModel {
    fullname: string;
    email: string;
    password: string;
    phoneNumber: number;
    medicalInformation: {
        Known_Allergies: string,
        Chronic_Conditions: string,
        Medications: string,
    };
    emergency_Contact: {
        contactName: string,
        contactNumber : number
    }

}

export default userModel;