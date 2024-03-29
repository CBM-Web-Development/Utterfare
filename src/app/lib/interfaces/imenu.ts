export interface IMenuItemSection{
    items?: number[], 
    title?: string
}

export interface IMenu {
    id: number;
    vendorId: number;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date; 
    sections?: string;
    sectionsObj?: IMenuItemSection[];
    order?: number;
    active?: boolean;
}
