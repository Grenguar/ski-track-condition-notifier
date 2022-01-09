module.exports = {
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80,
  //   },
  // },
  collectCoverageFrom: ['src/**/*.ts'],
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text'],
  automock: false,
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
};
