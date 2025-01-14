/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        cardGradient: "linear-gradient(to bottom,transparent 70%,#390741)",
      },
      fontFamily: {
        nunito: ["Nunito", "serif"],
      },
      colors: {
        primary: {
          100: "#FFE1EA",
          200: "#FFB1C8",
          300: "#FF6390",
          400: "#FF1659",
          500: "#C70039",
          600: "#95002B",
          700: "#64001D",
          800: "#32000E",
          900: "#200009",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        second: {
          100: "#F4EBF2",
          200: "#EFC4E2",
          300: "#DF89C6",
          400: "#CF4FA9",
          500: "#A62D82",
          600: "#7D2262",
          700: "#531741",
          800: "#411032",
          900: "#2A0B21",
        },
        third: {
          100: "#FAF1ED",
          200: "#F3E4DD",
          300: "#E8CABB",
          400: "#DCAF99",
          500: "#D19477",
          600: "#B8653E",
          700: "#7B4429",
          800: "#612F16",
          900: "#3D2215",
        },
        fourth: {
          100: "#F6F7FC",
          200: "#F1F2F6",
          300: "#E4E6ED",
          400: "#D6D9E4",
          500: "#C8CCDB",
          600: "#9AA1B9",
          700: "#646D89",
          800: "#424C6B",
          900: "#2A2E3F",
        },
        other_first: {
          100: "#FFF6D4",
          500: "#393735",
        },
        other_second: {
          100: "#E7FFE7",
          500: "#197418",
        },
        utility: {
          primary: "#FFFFFF",
          second: "#000000",
          third: "#AF2758",
          bg: "#160404",
          bgMain: "#FCFCFE",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "bg-card":
          "radial-gradient(circle at 3.13% 0%, #742138 23.43%, #A878BF 100%)",
      },
    },
  },
  plugins: [daisyui, require("tailwindcss-animate")],
  daisyui: {
    themes: ["light"],
  },
};
