export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  maxWorkers: 1
};