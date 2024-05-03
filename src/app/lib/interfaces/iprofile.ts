export interface IProfile {
    id: number; 
    userId: number;
    firstName?: string; 
    lastName?: string; 
    emailAddress: string;
    phoneNumber?: string;
    profilePicture?: string;
    birthday?: Date
}