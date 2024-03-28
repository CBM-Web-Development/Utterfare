import { IMenuItem } from "./imenu-item";
import { IVendor } from "./ivendor";

export interface ISearchResult {
    vendor: IVendor; 
    distance: number; 
    item: IMenuItem;
    rank: number;
}
