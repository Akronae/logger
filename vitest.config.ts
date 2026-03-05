import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['.yarn', '*.config.js', '*.config.ts', 'dist', 'node_modules'],
    globalSetup: ['./vitest.setup.ts'],
  },
  plugins: [viteTsconfigPaths()],
});
