interface userModel {
    fullname: string;
    email: string;
    password: string;
    phoneNumber: string; // Changed to string to handle large numbers
    medicalInformation: {
        Known_Allergies: string;
        Chronic_Conditions: string;
        Medications: string;
    };
    emergency_Contact: {
        contactName: string;
        contactNumber: string; // Changed to string to handle large numbers
    };
}

export default userModel;
