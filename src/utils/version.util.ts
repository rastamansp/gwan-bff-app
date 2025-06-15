import * as fs from 'fs';
import * as path from 'path';

export interface BuildInfo {
    version: string;
    buildDate: string;
    environment: string;
    commit: string;
}

export interface PackageInfo {
    name: string;
    version: string;
    description: string;
    buildInfo?: BuildInfo;
}

export function getPackageInfo(): PackageInfo {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);

        return {
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description,
            buildInfo: packageJson.buildInfo
        };
    } catch (error) {
        console.warn('Erro ao ler package.json:', error);
        return {
            name: 'gwan-bff-app',
            version: 'unknown',
            description: 'Backend for Frontend application for Gwan',
            buildInfo: {
                version: 'unknown',
                buildDate: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                commit: 'unknown'
            }
        };
    }
}

export function displayVersionInfo(): void {
    const packageInfo = getPackageInfo();
    const logger = console;

    logger.log('\n🚀 === GWAN BFF APP ===');
    logger.log(`📦 Nome: ${packageInfo.name}`);
    logger.log(`🏷️  Versão: ${packageInfo.version}`);
    logger.log(`📝 Descrição: ${packageInfo.description}`);

    if (packageInfo.buildInfo) {
        logger.log(`🔧 Build Info:`);
        logger.log(`   - Versão: ${packageInfo.buildInfo.version}`);
        logger.log(`   - Data: ${new Date(packageInfo.buildInfo.buildDate).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
        logger.log(`   - Ambiente: ${packageInfo.buildInfo.environment}`);
        logger.log(`   - Commit: ${packageInfo.buildInfo.commit}`);
    }

    logger.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    logger.log('================================\n');
} 