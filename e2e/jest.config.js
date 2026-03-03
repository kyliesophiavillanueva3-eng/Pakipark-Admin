module.exports = {
  testTimeout: 120000,
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'],
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
