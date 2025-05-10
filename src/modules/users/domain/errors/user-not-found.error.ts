export class UserNotFoundError extends Error {
    constructor(id: string) {
        super(`Usuário com ID "${id}" não encontrado.`);
        this.name = 'UserNotFoundError';
    }
} 