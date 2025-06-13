export function validateEnv() {
    const requiredEnvVars = [
        'NODE_ENV',
        'PORT',
        'API_URL',
        'MONGODB_URI',
        'JWT_SECRET',
        'ALLOWED_ORIGINS'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
    }
} 