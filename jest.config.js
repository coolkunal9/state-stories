module.exports = {
  testEnvironment: "node",
  testMatch: ["**/server/tests/**/*.test.js"],
  verbose: true,
  testTimeout: 180000,
  setupFilesAfterEnv: ["<rootDir>/server/tests/setup.js"],
};
