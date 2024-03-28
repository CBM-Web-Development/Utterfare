import { ILocation } from "./ilocation";

export interface ISearchRequest {
    terms: string; 
    location: ILocation;
    userId?: number;
}
