import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--c-ink-soft) / <alpha-value>)",
        tomato: "rgb(var(--c-tomato) / <alpha-value>)",
        mustard: "rgb(var(--c-mustard) / <alpha-value>)",
        "mustard-ink": "rgb(var(--c-mustard-ink) / <alpha-value>)",
        leaf: "rgb(var(--c-leaf) / <alpha-value>)",
        berry: "rgb(var(--c-berry) / <alpha-value>)",
        peach: "rgb(var(--c-peach) / <alpha-value>)",
      },
      fontFamily: {
        hand: ["var(--font-yomogi)", "cursive"],
        sans: ["var(--font-zen-maru)", "sans-serif"],
      },
      boxShadow: {
        sticker: "4px 5px 0 0 rgb(var(--c-ink))",
        "sticker-sm": "2px 3px 0 0 rgb(var(--c-ink))",
      },
    },
  },
  plugins: [],
};
export default config;
