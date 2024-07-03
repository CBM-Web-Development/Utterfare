export interface IVendor {
    id: number;
    name: string;
    description?: string;
    type?: string;
    category?: string;
    website?: string;
    primaryPhone?: string;
    profilePicture?: string;
    handicapAccessible?: boolean;
    liveMusic?: boolean;
    veteranOwned?: boolean;
    womanOwned?: boolean;
    petFriendly?: boolean;
    rooftopBar?: boolean;
    slug: string;
}
