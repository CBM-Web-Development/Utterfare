export interface IMedia {
    id?: number; 
    type?: string;
    url?: string;
    ownerId?: number;
    caption?: string;
    name?: string;
    description?: string;
    dateUploaded?: Date;
    lastUpdated?: Date;
}