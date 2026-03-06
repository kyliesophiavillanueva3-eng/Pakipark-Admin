module.exports = {
  testTimeout: 120000,
  testMatch: ['<rootDir>/tests/e2e/**/*.e2e.ts'],
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
