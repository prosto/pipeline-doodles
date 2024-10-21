const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig");

const tsconfigPaths = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/",
});

module.exports = {
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...tsconfigPaths,
  },
  transformIgnorePatterns: ["<rootDir>/node_modules"],
  preset: "@repo/jest-presets/jest/node",
};
