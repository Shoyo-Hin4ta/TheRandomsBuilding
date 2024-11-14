// backend/jest.config.js
export default {
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['dotenv/config'],
  transform: {},
  testTimeout: 10000
};