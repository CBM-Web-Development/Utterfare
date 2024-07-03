import { IVendor } from "./ivendor";
import { IVendorItem } from "./ivendor-item";

export interface ISearchResult {
    vendor: IVendor; 
    distance: number; 
    item: IVendorItem;
    rank: number;
}
