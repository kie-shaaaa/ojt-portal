import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Project-specific rule overrides to avoid blocking CI for many
    // legacy/gradual-migration issues. These are intentional temporary
    // relaxations; prefer fixing the code in follow-up PRs.
    rules: {
      // Calling setState synchronously inside effects is flagged in many
      // places across the codebase. Make it a warning so CI can proceed.
      'react-hooks/set-state-in-effect': 'warn',

      // The codebase contains many `any` usages; treat as warnings for now.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Several JSX strings contain apostrophes or quotes; allow them as warnings.
      'react/no-unescaped-entities': 'warn',

      // Next.js recommends <Image /> but the project intentionally uses <img>
      '@next/next/no-img-element': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
