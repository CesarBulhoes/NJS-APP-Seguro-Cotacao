const config = require('./jest.config');

config.testMatch = ['**/__tests__/integration/**/*.spec.js', '**/__tests__/integration/**/*.test.js'];
module.exports = config;
