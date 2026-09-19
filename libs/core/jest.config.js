module.exports = {
  // E2E tests timeout configuration
  testTimeout: 60000, // 60 seconds for E2E tests that may be slow

  // Setup files for E2E tests
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.js'],

  // Test patterns
  testMatch: [
    '**/__tests__/**/*.(js|ts|tsx)',
    '**/*.(test|spec|e2e).(js|ts|tsx)'
  ],

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.*',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/**/*.e2e.*'
  ]
};