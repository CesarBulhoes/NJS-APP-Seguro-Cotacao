const config = require('./jest.config');

config.testMatch = ['**/__tests__/unit/**/*.spec.js'];
config.collectCoverageFrom = ['**/src/**/*.js', '!**/src/Config/**', '!**/src/DAO/**'];
module.exports = config;
