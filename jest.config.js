/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts', '**/?(*.)+(spec|test).tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '__tests__'
  ],
  setupFiles: ['<rootDir>/src/backend/tests/polyfills/text-encoder.js'],
  setupFilesAfterEnv: ['<rootDir>/src/backend/tests/setup.ts'],
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js,tsx,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/backend/tests/**',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}; 