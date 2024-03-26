export interface IVendorLocation {
    id: number;
    vendorId: number;
    name?: string;
    streetNumber?: string;
    route?: string;
    neighborhood?: string;
    locality?: string;
    administrativeAreaLevel1?: string;
    administrativeAreaLevel2?: string;
    postalCode?: string;
    postalCodesuffix?: string;
    country?: string;
    placeId?: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
}
