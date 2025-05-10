import { Document } from 'mongoose';

export abstract class BaseEntity extends Document {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(partial: Partial<BaseEntity>) {
        super();
        Object.assign(this, partial);
    }
} 