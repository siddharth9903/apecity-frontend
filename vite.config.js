<<<<<<< Updated upstream
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from 'path'; 
import fs from 'fs'; 
import mkcert from 'vite-plugin-mkcert'
=======
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
>>>>>>> Stashed changes

export default defineConfig({
  server: {
    port: 3002,
  },
<<<<<<< Updated upstream
  // plugins: [react(), nodePolyfills(), mkcert()],
  plugins: [react(), nodePolyfills()],
=======
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
    nodePolyfills(),
  ],
>>>>>>> Stashed changes
  resolve: {
    alias: {
      jsbi: path.resolve(__dirname, './node_modules/jsbi/dist/jsbi-cjs.js'),
      '~@fontsource/ibm-plex-mono': '@fontsource/ibm-plex-mono',
      '~@fontsource/inter': '@fontsource/inter',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
<<<<<<< Updated upstream
  // optimizeDeps: {
  //   exclude: [
  //     'chunk-VYLSSWN7',
  //     'chunk-WBLKP2NB',
  //     'chunk-52VWBBYV',
  //     'chunk-6ONWK6IR',
  //     'chunk-4UVVM2Y5'
  //   ]
  // },
})
=======
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
>>>>>>> Stashed changes
