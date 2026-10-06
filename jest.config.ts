import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'jsdom',
  watchman: false,
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'commonjs', moduleResolution: 'node', types: ['node', 'jest', '@testing-library/jest-dom'] }, diagnostics: false }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts?(x)'],
  collectCoverageFrom: ['features/**/*.{ts,tsx}'],
  coverageThreshold: { global: { statements: 70 }, './features/': { statements: 70 } },
};
export default config;
