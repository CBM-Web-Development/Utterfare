export interface IPersonalDetails {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthday?: Date;    
}

export interface IUser {
    id?: number; 
    profileId?: number;
    profilePictureUrl?: string;
    personalDetails?: IPersonalDetails;
    username?: string;
    isVerified?: boolean;
}
