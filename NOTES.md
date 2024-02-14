# Notes

- https://github.com/joaopalmeiro/social-media-icons
- https://www.freecodecamp.org/news/how-to-create-and-publish-a-vue-component-library-update/ + https://github.com/briancbarrow/vue-component-library-2023
- https://vitejs.dev/guide/build.html#library-mode
- `npm create vite@latest`
- `npm install vue && npm install -D @vitejs/plugin-vue typescript vite vue-tsc`
- https://vitejs.dev/guide/api-hmr.html#intellisense-for-typescript (`/// <reference types="vite/client" />`)
- `npm install -D social-media-icons`
- https://bobbyhadz.com/blog/typescript-cannot-find-name-dirname
- `npm install -D @types/node`
- https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vue-ts
- https://github.com/vuejs/create-vue
- https://www.typescriptlang.org/tsconfig#moduleResolution
- https://www.npmjs.com/package/vue-tsc
- `npm install -D @types/node @tsconfig/node18 @vue/tsconfig`
- `npm install -D publint`
- https://github.com/vuejs/core/tree/main/packages/compiler-sfc
- https://www.npmjs.com/package/svgson
- https://github.com/unjs/jiti: `npm install -D jiti`
- https://github.com/vuejs/vue/issues/10183 + https://www.npmjs.com/package/@vue/server-renderer
- https://vuejs.org/guide/extras/render-function.html
- https://github.com/vuejs/create-vue/blob/v3.7.2/.prettierrc
- `npm install -D npm-run-all`
- https://www.jsgarden.co/blog/create-a-vue-3-component-with-typescript
- https://www.npmjs.com/package/@heroicons/vue
- https://github.com/xiaoluoboding/vue-library-starter
- https://github.com/LinusBorg/vue-lib-template
- https://github.com/LinusBorg/vue-lib-template/blob/main/packages/lib/package.json
- https://github.com/tailwindlabs/heroicons/blob/master/vue/package.json#L144: `"peerDependencies": { "vue": ">= 3" }`
- https://github.com/wuruoyun/vue-component-lib-starter
- https://blog.ayitinya.me/articles/how-to-create-and-publish-vue-component-to-npm
- https://github.com/ayitinya/vue-typewriter-effect
- https://www.matijanovosel.com/blog/making-and-publishing-components-with-vue-3-and-vite: `"peerDependencies": { "vue": "^3.0.0" }`
- https://github.com/unjs/unbuild/issues/80
- https://github.com/wobsoriano/vue-sfc-unbuild
- https://github.com/jsonleex/demo-mkdist
- https://github.com/kaandesu/vue3-component-library-template
- https://github.com/qmhc/vite-plugin-dts
- https://github.com/qmhc/vite-plugin-dts/tree/main/examples/vue
- https://github.com/qmhc/vite-plugin-dts/issues/267
- https://github.com/qmhc/vite-plugin-dts/issues/267#issuecomment-1786996676
- https://github.com/qmhc/vite-plugin-dts/blob/main/package.json#L66: `"dependencies": { "vue-tsc": "^1.8.26" }` + `"peerDependencies": { "typescript": "*", "vite": "*" }`

## Snippets

### Workaround to generate different declaration files by Will Stone and Matt Kilpatrick

- https://github.com/qmhc/vite-plugin-dts/issues/267#issuecomment-1786996676
- https://github.com/qmhc/vite-plugin-dts/issues/267#issuecomment-1839043850
- `copyFileSync("dist/index.d.ts", "dist/index.d.cts");` if `"type": "module"`
- https://github.com/ektotv/xmltv/blob/main/vite.config.js + https://github.com/ektotv/xmltv/blob/main/package.json
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#packagejson-exports-imports-and-self-referencing

```ts
import { copyFileSync } from "node:fs"

import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {...},
  plugins: [
    ...,
    dts({
      afterBuild: () => {
        // To pass publint (`npm x publint@latest`) and ensure the
        // package is supported by all consumers, we must export types that are
        // read as ESM. To do this, there must be duplicate types with the
        // correct extension supplied in the package.json exports field.
        copyFileSync("dist/index.d.ts", "dist/index.d.mts")
      },
      exclude: [ ... ],
      include: ["src"],
    }),
  ],
})
```

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/main.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/main.cjs"
      }
    }
  }
}
```

```json
// package.json
{
  "name": "my-package",
  "type": "module",
  "exports": {
    ".": {
      // Entry-point for `import "my-package"` in ESM
      "import": {
        // Where TypeScript will look.
        "types": "./types/esm/index.d.ts",
        // Where Node.js will look.
        "default": "./esm/index.js"
      },
      // Entry-point for `require("my-package") in CJS
      "require": {
        // Where TypeScript will look.
        "types": "./types/commonjs/index.d.cts",
        // Where Node.js will look.
        "default": "./commonjs/index.cjs"
      }
    }
  },
  // Fall-back for older versions of TypeScript
  "types": "./types/index.d.ts",
  // CJS fall-back for older versions of Node.js
  "main": "./commonjs/index.cjs"
}
```
