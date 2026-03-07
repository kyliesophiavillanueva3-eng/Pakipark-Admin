module.exports = {
  testTimeout: 120000,
  testMatch: ['<rootDir>/tests/e2e/**/*.e2e.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/init.js'],
  reporters: ['detox/runners/jest/streamlineReporter'],
  testEnvironment: 'node',
  verbose: true,
};
