import { IMedia } from "./imedia";
import { IVendor } from "./ivendor";
import { IVendorItem } from "./ivendor-item";
import { IVendorItemReview } from "./ivendor-item-review";

export interface IMenuItem {
    vendor?: IVendor;
    vendorItem?: IVendorItem;
    itemReviews?: IVendorItemReview[];
    itemMedia?: IMedia[];
}
