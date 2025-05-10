import { Name } from '../value-objects/name.value-object';
import { Email } from '../../../auth/domain/value-objects/email.value-object';

export class User {
    private readonly _id: string;
    private _name: Name;
    private _email: Email;
    private _isVerified: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string,
        name: Name,
        email: Email,
        isVerified: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._isVerified = isVerified;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public static create(
        id: string,
        name: string,
        email: string,
        isVerified: boolean = false,
    ): User {
        return new User(
            id,
            Name.create(name),
            Email.create(email),
            isVerified,
            new Date(),
            new Date(),
        );
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name.getValue();
    }

    public get email(): string {
        return this._email.getValue();
    }

    public get isVerified(): boolean {
        return this._isVerified;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public updateName(name: string): void {
        this._name = Name.create(name);
        this._updatedAt = new Date();
    }

    public verify(): void {
        this._isVerified = true;
        this._updatedAt = new Date();
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name.getValue(),
            email: this._email.getValue(),
            isVerified: this._isVerified,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
} 