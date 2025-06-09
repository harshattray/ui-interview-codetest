/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^d3$': '<rootDir>/src/__mocks__/d3.js',
    '^d3-(.*)$': '<rootDir>/src/__mocks__/d3.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      }
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
