import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "./src/index.ts",
      name: "MarkdownParser",
      fileName: "markdown-parser",
    },
    rollupOptions: {
      external: ["highlight.js"],
      output: {
        globals: {
          "highlight.js": "hljs",
        },
      },
    },
  },
});
