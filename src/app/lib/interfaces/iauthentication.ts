export interface IAuthentication {
    id: number; 
    username: string;
    token: string;
    vendorId?: string;
    type: string;
    accountsId: number[];
    authorities?: string;
}