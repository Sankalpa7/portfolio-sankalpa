import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  // ✅ ESLint v9 ignores (replaces .eslintignore)
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "build/**",
      "write-projects.js"
    ],
  },

  // ✅ Next.js Core Web Vitals rules
  ...nextVitals,

  // ✅ Next.js + TypeScript rules
  ...nextTs,
])