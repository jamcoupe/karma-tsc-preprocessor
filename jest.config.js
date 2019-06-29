module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: [
    "**/*.spec.js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/integration/"
  ],
};
