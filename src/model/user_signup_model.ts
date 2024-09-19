interface UserSignUpModel {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber: number;
    gender: string;
    dateofbirth: string;
    medicalInformation: {
        bloodGroup : string,
        Weight: string,
        Height : string,
        Known_Allergies: [],
        Chronic_Conditions: [],
    };
    emergency_Contact: {
        contactName: string,
        contactNumber: number
    }

}

export default UserSignUpModel;