import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8C42',
          dark: '#E67A35',
        },
        ocean: {
          light: '#A8DADC',
          DEFAULT: '#457B9D',
          dark: '#1D3557',
        },
      },
    },
  },
  plugins: [],
};
export default config;
