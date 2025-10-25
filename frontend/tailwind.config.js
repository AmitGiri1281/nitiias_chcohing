/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f5f9ff",
          100: "#e6f0ff",
          200: "#cce0ff",
          300: "#99c2ff",
          400: "#4d94ff",
          500: "#1d4ed8",  // Main blue (matches your logo)
          600: "#1e40af",  // Darker shade for hover
          700: "#1e3a8a",  // Even deeper for contrast
          800: "#172554",  
          900: "#0f172a",
        },
        accent: {
          100: "#fff7e6",
          300: "#ffe08c",
          500: "#facc15",  // Golden yellow (for CTA buttons / highlights)
          600: "#eab308",
          700: "#ca8a04",
        },
        neutral: {
          100: "#f9fafb",
          200: "#f3f4f6",
          300: "#e5e7eb",
          500: "#6b7280",
          700: "#374151",
          900: "#111827",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
