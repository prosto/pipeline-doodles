module.exports = {
  roots: ["<rootDir>"],
  transform: {
    // '^.+\\.tsx?$' to process ts with `ts-jest`
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/test/__fixtures__", "<rootDir>/dist"],
  preset: "ts-jest/presets/default-esm",
};
