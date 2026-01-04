import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // هذا اللون سيمكنك من استخدام `border-border`
        border: "hsl(210, 16%, 82%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
