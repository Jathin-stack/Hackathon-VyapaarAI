/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      colors: {
        paper: { DEFAULT: '#FDF9F1', card: '#FFFCF5' },
        ink: {
          DEFAULT: '#2A1F14',
          soft: 'rgba(63,46,30,0.65)',
          faint: 'rgba(63,46,30,0.45)',
          50: '#FDF9F1', 100: '#F4EEDF', 200: '#E8DCBF',
          300: '#D4C09A', 400: '#B89A6A', 500: '#8A6840',
          600: '#6B5836', 700: '#4A3A24', 800: '#3A2D1A', 900: '#2A1F14',
        },
        primary: { DEFAULT: '#F5A623', deep: '#E8901A', 50: '#FEF7E6', 100: '#FDECC5', 200: '#FBD88A', 300: '#F9C44F', 400: '#F5A623', 500: '#E8901A', 600: '#C9760F', 700: '#A35F0C' },
        secondary: { DEFAULT: '#C1440E', deep: '#9B2E00', darkest: '#6B1F04', 50: '#FFF3EE', 100: '#FDE1D4', 200: '#F9B89A', 300: '#F08055', 400: '#E0581F', 500: '#C1440E', 600: '#9B2E00', 700: '#6B1F04' },
        sale: { DEFAULT: '#2F7D4E', deep: '#22683F', light: '#E8F4EC' },
        purchase: { DEFAULT: '#7A4E9B', deep: '#5A3778', light: '#F1E9F8' },
        credit: { DEFAULT: '#F5A623', deep: '#C9760F', light: '#FDECC5' },
        inventory: { DEFAULT: '#4C8DB5', deep: '#315C7B', light: '#E5F0F7' },
        overdue: { DEFAULT: '#EF4444', deep: '#9B2E00', light: '#FDE1DC' },
        whatsapp: { DEFAULT: '#25D366', deep: '#128C7E' },
        brand: {
          50: '#FEF7E6', 100: '#FDECC5', 200: '#FBD88A',
          300: '#F9C44F', 400: '#F5A623', 500: '#E8901A',
          600: '#C1440E', 700: '#9B2E00', 800: '#6B1F04', 900: '#3D1002',
        },
      },
      boxShadow: {
        hero: '0 24px 60px -20px rgba(155,46,0,0.55), 0 8px 20px -8px rgba(193,68,14,0.3)',
        glass: '0 8px 24px -12px rgba(42,31,20,0.15)',
        card: '0 4px 14px -6px rgba(42,31,20,0.08)',
        glow: '0 6px 14px -4px rgba(193,68,14,0.4)',
        'glow-sale': '0 6px 14px -4px rgba(47,125,78,0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(120% 90% at 0% 0%, rgba(255,210,120,0.75) 0%, transparent 55%), radial-gradient(120% 90% at 100% 100%, rgba(90,15,0,0.85) 0%, transparent 60%), linear-gradient(135deg, #E8901A 0%, #C1440E 55%, #6B1F04 100%)',
        'kirana-bg': 'radial-gradient(60% 40% at 50% 0%, #FEEFCF 0%, #FDF9F1 60%, #FDF9F1 100%)',
        'marigold-radial': 'radial-gradient(circle, #FFB84D 0%, transparent 60%)',
      },
      borderRadius: { xl: '14px', '2xl': '20px', '3xl': '24px' },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        overduePulse: { '0%,100%': { boxShadow: '0 4px 14px -6px rgba(239,68,68,0.15)' }, '50%': { boxShadow: '0 6px 22px -6px rgba(239,68,68,0.35)' } },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        slideUp: 'slideUp 0.35s cubic-bezier(.2,.7,.3,1) both',
        fadeIn: 'fadeIn 0.3s ease-out both',
        overduePulse: 'overduePulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
