import { defineConfig } from "vite"

export default defineConfig({
  publicDir: "static",
  oxc: {
    jsx: {
      runtime: "automatic",
      importSource: "preact"
    }
  }
})
