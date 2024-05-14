import { IMedia } from "./imedia";
import { IProfile } from "./iprofile";
import { IUser } from "./iuser";
import { IVendor } from "./ivendor";
import { IVendorItem } from "./ivendor-item";

export interface IFeedItem {
    id?: number; 
    media?: IMedia[], 
    content?: string, 
    type?: 'review' | 'post'
    rating?: number;
    datePublished?: Date;
    edited?: boolean;
    userId?: number;
    profileId?: number;
    profile?: IProfile;
    user?: IUser;
    vendorId?: number;
    vendor?: IVendor;
    itemId?: number;
    item?: IVendorItem;
    parentId?: number;
    replyTo?: number; 
};