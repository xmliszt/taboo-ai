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
    screens: {
      xs: '432px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
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
        'primary-translucent': 'hsl(var(--primary-translucent))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'secondary-translucent': 'hsl(var(--secondary-translucent))',
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
        'ping-once': 'ping 1s linear 1',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-inout': 'fade-in-out 2s infinite cubic-bezier(.5856, .0703, .4143, .9297)',
        'fade-inout-1s-linear': 'fade-in-out 1s infinite linear',
        'fade-in-for-target-word': 'fade-in-for-target-word 1s linear',
        'small-bounce-delay-1-loop':
          'smallBounce 300ms alternate infinite cubic-bezier(.2, .65, .6, 1)',
        'small-bounce-delay-2-loop':
          'smallBounce 300ms alternate 100ms infinite cubic-bezier(.2, .65, .6, 1)',
        'small-bounce-delay-3-loop':
          'smallBounce 300ms alternate 200ms infinite cubic-bezier(.2, .65, .6, 1)',
        'dynamic-spin': 'full-spin 2s infinite cubic-bezier(.5856, .0703, .4143, .9297)',
        'dynamic-breath': 'breath 2s infinite cubic-bezier(.5856, .0703, .4143, .9297)',
        'background-translate': 'background-translate 15s infinite ease',
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
        fadeOut: {
          '0%': { opacity: 100 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
        'fade-in-for-target-word': {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.3 },
        },
        moveIn: {
          '0%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'fade-in-out': {
          '0%': { opacity: 0 },
          '50%': { opacity: 1 },
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
        'full-spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        breath: {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(0.75)',
            opacity: 0.2,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
        'background-translate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      blur: {
        sm: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
