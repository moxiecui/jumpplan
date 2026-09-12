const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  {
    ignores: ["dist/**", ".expo/**", "node_modules/**", ".tools/**"]
  },
  ...expoConfig,
  {
    files: ["app/**/*.tsx", "src/training/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["@/context/*", "@/data/plan", "@/data/adaptiveProgram", "@/logic/readiness*", "@/logic/nextSessionRecommendation", "@/logic/sessionSchedule", "@/logic/trainingAdjustment"], message: "旧计划与建议仅供历史兼容；正常执行必须使用src/training中的统一流程。" }]
      }]
    }
  },
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
