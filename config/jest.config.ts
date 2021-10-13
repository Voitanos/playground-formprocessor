module.exports = async () => {
  let jestConfig: any = {
    collectCoverage: true,
    coverageDirectory: "<rootDir>/temp",
    coverageReporters: [
      "json",
      "lcov",
      "text-summary",
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    },
    globals: {
      TEST_MODE: true,
    },
    moduleFileExtensions: [
      "ts",
      "js",
      "json"
    ],
    rootDir: ".",
    testMatch: [
      "**/*.spec.ts"
    ],
    testEnvironment: "node", // default = "jsdoc"
    testURL: "http://www.something.com/test.html",
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    verbose: false
  };

  jestConfig.verbose = (process.argv.indexOf('--verbose') > -1);

  return jestConfig;
};