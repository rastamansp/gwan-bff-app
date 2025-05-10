import { ValueObject } from '../../../../core/domain/value-objects/value-object';
import { InvalidEmailError } from '../errors/invalid-email.error';

export class Email extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(email: string): Email {
        if (!this.isValid(email)) {
            throw new InvalidEmailError(email);
        }
        return new Email(this.normalize(email));
    }

    private static isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static normalize(email: string): string {
        return email.toLowerCase().trim();
    }

    public getValue(): string {
        return this._value;
    }

    public equals(other: Email): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }
} 