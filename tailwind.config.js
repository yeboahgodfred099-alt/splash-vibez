/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080C14',
          surface: '#0F172A',
          card: '#131D31',
          border: '#1E293B',
          cyan: '#00E5FF',
          'cyan-hover': '#00B4D8',
          coral: '#F43F5E',
          'coral-hover': '#E11D48',
          accent: '#38BDF8',
          muted: '#94A3B8',
          subtle: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 229, 255, 0.3)',
        'glow-coral': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

