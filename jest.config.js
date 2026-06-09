module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/firebase/(.*)$': '<rootDir>/src/firebase/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@features/(.*)$': '<rootDir>/features/$1',
    '^assets/(.*)$': '<rootDir>/assets/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/tests/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
