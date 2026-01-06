import type { Config } from "tailwindcss";

export default {
  darkMode: ['class', 'class'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	screens: {
  		'mobile': { 'max': '767px' },
  		'tablet': { 'min': '768px', 'max': '1279px' },
  		'desktop': { 'min': '1280px', 'max': '1919px' },
  		'desktop-lg': { 'min': '1920px' },
  		// Keep standard breakpoints as well
  		'sm': '640px',
  		'md': '768px',
  		'lg': '1024px',
  		'xl': '1280px',
  		'2xl': '1536px',
  	},
  	extend: {
  		colors: {
  			// ===== Design System v3.0: Fresh & Healthy =====
  			// Primary: Green (Energy & Vitality)
  			green: {
  				'50': '#F0FDF4',
  				'100': '#DCFCE7',
  				'200': '#BBF7D0',
  				'300': '#86EFAC',
  				'400': '#4ADE80',
  				'500': '#22C55E',
  				'600': '#16A34A',
  				'700': '#15803D',
  				'800': '#166534',
  				'900': '#14532D',
  			},
  			// Secondary: Blue (Trust & Clarity)
  			blue: {
  				'50': '#EFF6FF',
  				'100': '#DBEAFE',
  				'200': '#BFDBFE',
  				'300': '#93C5FD',
  				'400': '#60A5FA',
  				'500': '#3B82F6',
  				'600': '#2563EB',
  				'700': '#1D4ED8',
  				'800': '#1E40AF',
  				'900': '#1E3A8A',
  			},
  			// Accent: Amber (Warmth & Highlights)
  			amber: {
  				'50': '#FFFBEB',
  				'100': '#FEF3C7',
  				'200': '#FDE68A',
  				'300': '#FCD34D',
  				'400': '#FBBF24',
  				'500': '#F59E0B',
  				'600': '#D97706',
  				'700': '#B45309',
  				'800': '#92400E',
  				'900': '#78350F',
  			},
  			// Legacy colors (keeping for gradual migration)
  			coral: {
  				'50': '#FFF5F0',
  				'100': '#FFE8DD',
  				'200': '#FFD0BB',
  				'300': '#FFB899',
  				'400': '#FFA077',
  				'500': '#FF8C5A',
  				'600': '#E67A4A',
  				'700': '#CC6B3A',
  				'800': '#A35630',
  				'900': '#7A4024'
  			},
  			sun: {
  				'50': '#FFF9F0',
  				'100': '#FFF0D9',
  				'200': '#FFE0B3',
  				'300': '#FFD08C',
  				'400': '#FFC166',
  				'500': '#FFB74D',
  				'600': '#E6A342',
  				'700': '#CC9038',
  				'800': '#A3732D',
  				'900': '#7A5622'
  			},
  			sage: {
  				'50': '#F3F6F4',
  				'100': '#E7EDE9',
  				'200': '#CFDBD2',
  				'300': '#B7C9BC',
  				'400': '#9FB7A5',
  				'500': '#7F9A83',
  				'600': '#6B8870',
  				'700': '#57765C',
  				'800': '#466149',
  				'900': '#354B38'
  			},
  			slate: {
  				'50': '#F0F4F6',
  				'100': '#E1E9ED',
  				'200': '#C3D3DB',
  				'300': '#A5BDC9',
  				'400': '#87A7B7',
  				'500': '#5995B7',
  				'600': '#4A7A9A',
  				'700': '#3B627C',
  				'800': '#2F4F64',
  				'900': '#254B5A'
  			},
  			cream: '#F9F7F2',
  			canvas: 'rgb(var(--bg-canvas) / <alpha-value>)',
  			surface: 'rgb(var(--bg-surface) / <alpha-value>)',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			success: 'rgb(var(--color-success) / <alpha-value>)',
  			warning: '#FFB74D',
  			error: '#E7AAAA',
  			info: '#5995B7',
  			hanki: {
  				bowl: '#4A90D9',
  				rice: '#FFFEF5',
  				steam: '#E8E8E8',
  				blush: '#FFB7C5'
  			},
  			league: {
  				bronze: '#CD7F32',
  				silver: '#C0C0C0',
  				gold: '#FFD700',
  				platinum: '#E5E4E2',
  				diamond: '#B9F2FF'
  			},
  			text: {
  				primary: 'rgb(var(--text-primary) / <alpha-value>)',
  				secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
  				muted: '#9E9E9E'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-pretendard)',
  				'Pretendard',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-display)',
  				'Plus Jakarta Sans',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			display: [
  				'32px',
  				{
  					lineHeight: '40px',
  					fontWeight: '700'
  				}
  			],
  			h1: [
  				'24px',
  				{
  					lineHeight: '32px',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'20px',
  				{
  					lineHeight: '28px',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'16px',
  				{
  					lineHeight: '24px',
  					fontWeight: '600'
  				}
  			],
  			'body-lg': [
  				'16px',
  				{
  					lineHeight: '24px',
  					fontWeight: '400'
  				}
  			],
  			body: [
  				'14px',
  				{
  					lineHeight: '20px',
  					fontWeight: '400'
  				}
  			],
  			caption: [
  				'12px',
  				{
  					lineHeight: '16px',
  					fontWeight: '400'
  				}
  			],
  			overline: [
  				'10px',
  				{
  					lineHeight: '14px',
  					fontWeight: '500'
  				}
  			]
  		},
  		spacing: {
  			'1': '4px',
  			'2': '8px',
  			'3': '12px',
  			'4': '16px',
  			'5': '20px',
  			'6': '24px',
  			'8': '32px',
  			'10': '40px',
  			'12': '48px',
  			'16': '64px'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '16px',
  			'2xl': '20px',
  			'3xl': '24px',
  			'4xl': '2rem',
  			'5xl': '2.5rem',
  			full: '9999px'
  		},
  		boxShadow: {
  			soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  			glow: '0 0 20px rgba(34, 197, 94, 0.3)',
  			'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
  			'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
  			'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
  		},
  		animation: {
  			float: 'float 3s ease-in-out infinite',
  			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  			'bounce-soft': 'bounce-soft 0.5s ease-out',
  			steam: 'steam 2s ease-in-out infinite',
  			confetti: 'confetti 1s ease-out forwards',
  			'level-up': 'level-up 0.6s ease-out'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'pulse-soft': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.7'
  				}
  			},
  			'bounce-soft': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			steam: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(0) scale(1)'
  				},
  				'50%': {
  					opacity: '0.6'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'translateY(-20px) scale(1.5)'
  				}
  			},
  			confetti: {
  				'0%': {
  					transform: 'translateY(0) rotate(0deg)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateY(-100px) rotate(720deg)',
  					opacity: '0'
  				}
  			},
  			'level-up': {
  				'0%': {
  					transform: 'scale(0.8)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.2)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
