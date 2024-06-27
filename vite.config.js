import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from 'path'; 
import fs from 'fs'; 
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002,
  },
  // plugins: [react(), nodePolyfills(), mkcert()],
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      jsbi: path.resolve(__dirname, "./node_modules/jsbi/dist/jsbi-cjs.js"),
      "~@fontsource/ibm-plex-mono": "@fontsource/ibm-plex-mono",
      "~@fontsource/inter": "@fontsource/inter",
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
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
