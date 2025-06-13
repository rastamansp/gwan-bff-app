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
        console.warn(`⚠️  Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
        console.warn('📝 Certifique-se de que as variáveis estão definidas no docker-compose.yml ou arquivo .env');

        // Em produção, falhar se variáveis críticas estiverem faltando
        if (process.env.NODE_ENV === 'production') {
            const criticalVars = ['MONGODB_URI', 'JWT_SECRET'];
            const missingCriticalVars = criticalVars.filter(varName => !process.env[varName]);

            if (missingCriticalVars.length > 0) {
                throw new Error(`Variáveis críticas não encontradas em produção: ${missingCriticalVars.join(', ')}`);
            }
        }
    }
} 