import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@ionic\/angular\/standalone$/,
        replacement: fileURLToPath(
          new URL('./projects/test-support/ionic-angular-standalone.stub.ts', import.meta.url),
        ),
      },
      {
        find: /^@ionic\/core\/components$/,
        replacement: fileURLToPath(
          new URL('./node_modules/@ionic/core/components/index.js', import.meta.url),
        ),
      },
    ],
  },
  test: {
    server: {
      deps: {
        inline: [/^@ionic\/angular/, /^@ionic\/core/],
      },
    },
  },
});
