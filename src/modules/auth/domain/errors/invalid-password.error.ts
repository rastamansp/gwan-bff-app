export class InvalidPasswordError extends Error {
    constructor() {
        super('A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número');
        this.name = 'InvalidPasswordError';
    }
} 