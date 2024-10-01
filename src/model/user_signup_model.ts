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
        weight: string,
        height : string,
        known_Allergies: [],
        chronic_Conditions: [],
    };
    emergency_Contact: [];

}

export default UserSignUpModel;