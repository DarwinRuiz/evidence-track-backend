/** @type {import("jest").Config} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    clearMocks: true,
};
