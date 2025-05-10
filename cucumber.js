module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/tests/steps/**/*.ts'],
        paths: ['src/tests/features/**/*.feature'],
        format: ['progress-bar', 'html:cucumber-report.html'],
        formatOptions: { snippetInterface: 'async-await' },
        parallel: 1,
        timeout: 30000
    }
}; 