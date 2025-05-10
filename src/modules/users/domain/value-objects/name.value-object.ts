import { ValueObject } from '../../../../core/domain/value-objects/value-object';
import { InvalidNameError } from '../errors/invalid-name.error';

export class Name extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(name: string): Name {
        if (!this.isValid(name)) {
            throw new InvalidNameError(name);
        }
        return new Name(this.normalize(name));
    }

    private static isValid(name: string): boolean {
        return name.length >= 3 && name.length <= 100;
    }

    private static normalize(name: string): string {
        return name.trim().replace(/\s+/g, ' ');
    }

    public getValue(): string {
        return this._value;
    }

    public equals(other: Name): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }
} 