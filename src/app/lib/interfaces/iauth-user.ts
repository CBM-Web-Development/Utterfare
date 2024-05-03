import { IAuthentication } from "./iauthentication";
import { IProfile } from "./iprofile";

export interface IAuthUser {
    auth: IAuthentication;
    profile: IProfile; 
}