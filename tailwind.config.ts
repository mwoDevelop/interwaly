import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5b21b6',
        accent: '#06b6d4'
      }
    }
  },
  plugins: []
} satisfies Config;
