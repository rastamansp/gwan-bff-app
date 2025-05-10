module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/modules/**/application/use-cases/__tests__/*.steps.ts'],
        paths: ['src/modules/**/application/use-cases/__tests__/*.feature'],
        format: ['progress-bar', 'html:cucumber-report.html'],
        formatOptions: { snippetInterface: 'async-await' },
        parallel: 2,
        worldParameters: {
            NODE_ENV: 'test'
        },
        timeout: 60000
    }
}; 