import { ValueObject } from '../../../../core/domain/value-objects/value-object';
import { InvalidPasswordError } from '../errors/invalid-password.error';

export class Password extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(password: string): Password {
        if (!this.isValid(password)) {
            throw new InvalidPasswordError();
        }
        return new Password(password);
    }

    private static isValid(password: string): boolean {
        // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    public getValue(): string {
        return this._value;
    }

    public equals(other: Password): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }
} 