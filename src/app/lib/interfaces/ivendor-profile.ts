import { IMenu } from "./imenu";
import { IMenuItem } from "./imenu-item";
import { IVendor } from "./ivendor";
import { IVendorItem } from "./ivendor-item";
import { IVendorLocation } from "./ivendor-location";

export interface IVendorProfile {
    vendor?: IVendor;
    locations?: IVendorLocation[];
    menus?: IMenu[];
    menuItems?: IVendorItem[];
}
