const fs = require('fs');
const path = require('path');

/**
 * Returns array of all folders that contain Azure Functions.
 *
 * @return {Array<string>}
 */
const azFunctionFolders = function () {
  return fs.readdirSync(__dirname)
    .filter(folder => fs.existsSync(path.resolve(__dirname, folder, 'function.json')));
};

/**
 * Returns array of all files to include when copying to the Wallaby.js work folder.
 *
 * @return {Array<string>}
 */
const getFilesToInclude = function () {
  let files = [];

  // add supporting files
  files.push(
    'config/jest.config.js',
    '*.d.ts',
    'package.json',
    '**/__mocks__/**/*.*',
    '**/function.json'
  );

  // include all code files in subfolders
  Array.prototype.push.apply(
    files,
    azFunctionFolders().map(functionFolder => `${functionFolder}/**/*.ts`)
  );

  // exclude the test files
  files.push(
    '!**/*.spec.ts'
  );

  return files;
}

/**
 * Returns array of all spec files to include executing the test runner.
 *
 * @return {Array<string>}
 */
 const getTestFilesToInclude = function () {
  return azFunctionFolders().map(functionFolder => `${functionFolder}/**/*.spec.ts`);
}

module.exports = function (wallaby) {
  return {
    debug: true,
    files: getFilesToInclude(),
    tests: getTestFilesToInclude(),
    filesWithNoCoverageCalculated: [
      '**/__mocks__/**/*.ts'
    ],
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({ module: 'commonjs' })
    },
    env: { type: 'node' },
    testFramework: 'jest',
    setup: function (wallaby) {
      const jestConfig = require('./config/jest.config.js');
      wallaby.testFramework.configure(jestConfig);
    },
    preprocessors: {
      // required for mocks to work
      '**/*.js?(x)': file => require('@babel/core').transform(
        file.content,
        { sourceMap: true, filename: file.path, presets: [require('babel-preset-jest')] })
    }
  };
};