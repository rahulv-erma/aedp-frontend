/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abel: ["var(--font-abel)"],
        questrial: ["Questrial", "sans-serif"],
      },
      colors: {
        pale_rose: "#DCC7C052",
        pewter: "#9B9D9D",
        charcoal: "#2D3031",
        coral: "#E48C72",
        dusty_coral: "#CA907F",
        whisper: "#F8F8F8",
        white: "#ffffff",
        linen: "#FBF4F1",
        "slate-gray": "#606263",
        "misty-gray": "#C5C5C5BF",
        terracota: "#E85D54",
        terracota10: "#E85D541A",
      },
      boxShadow: {
        soft: "0px 7.62px 7.52px 0px #00000003",
        elevated: [
          "0px 1.85px 10.74px 0px #00000006",
          "0px 8.15px 22.24px 0px #0000000A",
          "0px 20px 44.36px 0px #0000000D",
          "0px 38.52px 86.96px 0px #0000000F",
          "0px 64.81px 159.88px 0px #00000013",
          "0px 100px 273px 0px #0000001A",
        ].join(", "),
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#CA907F",
            },
          },
        },
      },
    }),
  ],
};
