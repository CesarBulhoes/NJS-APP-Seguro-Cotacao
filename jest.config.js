module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.spec.js', '**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/config/**']
};
