
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],

  // Use the GitHub Pages subdirectory in production.
  // Keep local development at localhost:5173.
  base: command === 'build' || isPreview
    ? '/bushido-chronicles/'
    : '/',
}));
