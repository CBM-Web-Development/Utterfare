import { IProfile } from "./iprofile";
import { IProfileConnection } from "./iprofile-connection";

export interface IProfileConnectionResponse {
    connection: IProfileConnection;
    profile: IProfile;
}