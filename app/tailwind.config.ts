import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          50: '#FFF8F0',
          100: '#FFEFD9',
          200: '#FFD9A8',
          300: '#FFC377',
          400: '#FFAD46',
          500: '#FF9500', // Main Orange
          600: '#E67A00',
          700: '#CC6600',
          800: '#A35200',
          900: '#7A3D00',
        },
        secondary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Main Green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        hanki: {
          bowl: '#4A90D9', // Traditional blue bowl
          rice: '#FFFEF5', // Warm white rice
          steam: '#E8E8E8', // Steam color
          blush: '#FFB7C5', // Blush pink
        },
        // League Colors
        league: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          platinum: '#E5E4E2',
          diamond: '#B9F2FF',
        },
        // UI Colors
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(255, 149, 0, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 0.5s ease-out',
        'steam': 'steam 2s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
        'level-up': 'level-up 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'bounce-soft': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(1.5)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        'level-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
