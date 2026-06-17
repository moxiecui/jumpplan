const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  {
    ignores: ["dist/**", ".expo/**", "node_modules/**", ".tools/**"]
  },
  ...expoConfig,
  {
    rules: {
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/static-components": "off"
    }
  },
  {
    files: ["scripts/**/*.cjs", "*.config.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly"
      }
    }
  }
];
