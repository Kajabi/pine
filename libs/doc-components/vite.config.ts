import { peerDependencies } from './package.json';

// import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      // entry: resolve(__dirname, 'src', 'index.ts'),
      entry: "./src/index.ts",
      name: 'pine-doc-components',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js'
      }
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    libInjectCss(),
    tsconfigPaths(),
    dts()
  ]
})
