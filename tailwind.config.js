/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'unicorn-flow': 'unicornFlow 10s ease-in-out infinite',
        'ping-once': 'ping 1s linear 1',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'carousell-20': 'moveIn 40s linear infinite',
        'carousell-18': 'moveIn 38s linear infinite',
        'carousell-16': 'moveIn 36s linear infinite',
        'carousell-14': 'moveIn 34s linear infinite',
        'carousell-12': 'moveIn 32s linear infinite',
        'carousell-10': 'moveIn 20s linear infinite',
        'fade-inout': 'fadeInOut 1.5s ease-in-out',
        'fade-inout-first-loop': 'fadeInOut 10s ease-in-out infinite',
        'fade-inout-delay-loop': 'fadeInOut 10s ease-in-out 5s infinite',
        'small-bounce-delay-1-loop':
          'smallBounce 300ms alternate infinite cubic-bezier(.2, .65, .6, 1)',
        'small-bounce-delay-2-loop':
          'smallBounce 300ms alternate 100ms infinite cubic-bezier(.2, .65, .6, 1)',
        'small-bounce-delay-3-loop':
          'smallBounce 300ms alternate 200ms infinite cubic-bezier(.2, .65, .6, 1)',
        'shake-head': 'shakeHead 0.35s once',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        unicornFlow: {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '0% 100%' },
        },
        fadeOut: {
          '0%': { opacity: 100 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
        moveIn: {
          '0%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        fadeInOut: {
          '0%': { opacity: 0 },
          '4%': { opacity: 0 },
          '7%': { opacity: 100 },
          '50%': { opacity: 100 },
          '53%': { opacity: 0 },
          '100%': { opacity: 0 },
        },
        smallBounce: {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(-5px)' },
        },
        shakeHead: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5px)' },
          '50%': { transform: 'translateX(0)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
