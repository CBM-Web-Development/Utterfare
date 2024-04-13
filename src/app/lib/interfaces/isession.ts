export interface ISession {
    id?: number; 
    userId?: number; 
    sessionId?: any;
    action?: string; 
    target?: string;
    vendorId?: number; 
    description?: string;
    date?: Date;
    location?: string | {};
    ipAddress?: string;
    device?: string;
    browser?: string;
    os?: string;
}