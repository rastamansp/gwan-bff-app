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
        return new Email(email.toLowerCase().trim());
    }

    private static isValid(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
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