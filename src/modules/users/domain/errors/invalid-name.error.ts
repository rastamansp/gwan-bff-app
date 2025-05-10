export class InvalidNameError extends Error {
    constructor(name: string) {
        super(`O nome "${name}" é inválido. Deve ter entre 3 e 100 caracteres.`);
        this.name = 'InvalidNameError';
    }
} 