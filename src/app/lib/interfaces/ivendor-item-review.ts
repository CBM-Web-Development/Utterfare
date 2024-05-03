import { IMedia } from "./imedia";
import { IProfile } from "./iprofile";

export interface IVendorItemReview {
    id?: number;
    itemId?: number;
    title?: string;
    content?: string; 
    rating?: number; 
    userId?: number;
    parent?: number;
    date?: Date;
    media?: number[];
    tmpMedia?: IMedia[];
    userProfile?: IProfile; 
    children?: IVendorItemReview[];
}