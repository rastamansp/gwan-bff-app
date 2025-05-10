export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gwan',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://bff.gwan.com.br',
            'https://www.bff.gwan.com.br',
            'https://admin.gwan.com.br',
            'https://www.admin.gwan.com.br',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    swagger: {
        title: 'GWAN API',
        description: 'API do sistema GWAN',
        version: '1.0',
    },
}); 