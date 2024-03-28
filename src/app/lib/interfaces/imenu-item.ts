export interface IMenuItem {
    id: number; 
    vendorId: number;
    itemName: string; 
    itemDescription?: string; 
    itemImage?: string; 
    isActive: boolean;
    isGlutenFree: boolean; 
    isHalal: boolean; 
    isKeto: boolean; 
    isKosher: boolean;
    isOrganic: boolean; 
    isSustainable: boolean;
    isVegan: boolean; 
    isVegetarian: boolean; 
    currency: string; 
    price: number;
}
