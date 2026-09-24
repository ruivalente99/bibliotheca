import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tokens: "src/tokens/index.ts",
    "ui/index": "src/ui/index.ts",
    "editor/index": "src/editor/index.ts",
    "preview/index": "src/preview/index.ts",
    "export/index": "src/export/index.ts",
    "auth/index": "src/auth/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  treeshake: true,
  minify: false,
});
