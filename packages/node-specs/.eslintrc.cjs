module.exports = {
  extends: ["@repo/eslint-config/library.js"],
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          snakeCase: true, // for node spec file names to be same as in python
        },
      },
    ],
  },
  ignorePatterns: ["**/__tests__/"],
};
