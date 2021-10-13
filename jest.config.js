/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "/__tests__/(.*).(test|spec)\\.[jt]sx?$",
  globalSetup: "<rootDir>/jest.globalSetup.js",
};
