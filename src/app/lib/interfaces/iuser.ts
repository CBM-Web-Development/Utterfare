export interface IPersonalDetails {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthday?: Date;    
}

export interface IContactDetails {
    emailAddress?: string;
    phoneNumber?: string;
}

export interface IPreference {

}

export interface IUser {
    id?: number; 
    profileId?: number;
    profilePictureUrl?: string;
    personalDetails?: IPersonalDetails;
    username?: string;
    password?: string;
    isVerified?: boolean;
    contactDetails?: IContactDetails;
    preferences?: IPreference;
    resetCode?: number;
    confirmPassword?: string;
}
