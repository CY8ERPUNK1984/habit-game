/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/unit/components/**/*.test.tsx', '**/tests/unit/contexts/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.jest.config.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '__tests__'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  verbose: true,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/frontend/**/*.{ts,js,tsx,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}; 