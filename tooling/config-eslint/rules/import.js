module.exports = {
  rules: {
    /**
     * Enforce a module import order convention.
     *
     * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
     */
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // Packages
          "internal", // Aliased modules
          "parent", // Relative parent
          "sibling", // Relative sibling
          "index", // Relative index
        ],
        pathGroups: [{ pattern: "@repo/ui/**", group: "internal" }],
        pathGroupsExcludedImportTypes: ["internal"],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
  },
};
