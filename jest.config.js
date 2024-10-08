/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
    rootDir: './src',
    verbose: false,
    bail: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    // preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\\.unit\\.test\\.ts$',
    transform: {
        "^.+\\.tsx?$": "esbuild-jest"
    }
};
