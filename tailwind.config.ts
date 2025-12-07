import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        bagel: ["var(--font-bagel)"],
        kbl: ["var(--font-kbl)"],
      },
      colors: {
        "brand-blue": "#005EEB", // Run 색상
        "brand-red": "#F55A00", // Duel 색상
        "primary-blue": "#06F", //기본 강조색
        "bg-gray": "#F7F7F8", //콘텐츠 배경
        "sub-gray": "rgba(55, 56, 60, 0.61)", //보조 텍스트
      },
    },
  },
  plugins: [],
};
export default config;
