export default {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {},
  testTimeout: 30000, // Increased timeout
  forceExit: true,
  detectOpenHandles: true
};