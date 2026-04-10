/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Mood Bar Custom Colors
        mood: {
          dark: '#121212',
          card: '#1A1A1A',
          gold: '#C8A97E', // Updated from #D4AF37
          'gold-light': '#D4B98F', // Updated from #E8D5A3
          cream: '#F5F0E1',
          text: '#C9B896',
          'text-muted': '#A89B7B',
          'charcoal-2': '#0A0A0A', // Added for background gradient bottom
          'light-gray': '#888888', // Added for secondary text
          'pure-white': '#FFFFFF', // Added for body text, slogan
          'pure-black': '#000000', // Added for button text
        },
        // Emotion Colors
        emotion: {
          happy: '#E8B4D9',
          tired: '#8B6F4E',
          anxious: '#5A9A9E',
          calm: '#D4D4C8',
          lonely: '#4A2C3A',
          energetic: '#F4A261',
          sad: '#6B3A5A',
          healing: '#E8E0E8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif SC', 'serif'],
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'gold': '0 0 12px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 24px rgba(212, 175, 55, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fluid-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
          "50%": { transform: "translateY(-20px) scale(1.1)", opacity: "0.5" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "rotate-glass": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "breathing": {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        },
        "glass-float": {
          "0%, 100%": {
            transform: "translateY(0)",
            opacity: "0.1"
          },
          "50%": {
            transform: "translateY(-13.33px)",
            opacity: "0.14"
          },
        },
        "slide-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)"
          },
          to: {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "scale-down": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(0.95)" },
        },
        "liquid-pour": {
          "0%": {
            height: "0px",
            opacity: "0.8"
          },
          "50%": {
            height: "30px",
            opacity: "1"
          },
          "100%": {
            height: "0px",
            opacity: "0"
          }
        },
        "liquid-fill-1": {
          "0%": {
            height: "0px",
            width: "0px"
          },
          "100%": {
            height: "4px",
            width: "64px"
          }
        },
        "ice-fall": {
          "0%": {
            transform: "translateY(0)",
            opacity: "0"
          },
          "20%": {
            opacity: "1"
          },
          "100%": {
            transform: "translateY(100px)",
            opacity: "1"
          }
        },
        "liquid-pour-2": {
          "0%": {
            height: "0px",
            opacity: "0.8"
          },
          "50%": {
            height: "30px",
            opacity: "1"
          },
          "100%": {
            height: "0px",
            opacity: "0"
          }
        },
        "liquid-fill-2": {
          "0%": {
            height: "0px",
            width: "0px"
          },
          "100%": {
            height: "6px",
            width: "48px"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fluid-gradient": "fluid-gradient 15s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "rotate-glass": "rotate-glass 1.5s linear infinite",
        "shake": "shake 0.3s ease-in-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up": "slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "breathing": "breathing 2s ease-in-out infinite",
        "glass-float": "glass-float 3s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.5s ease-out forwards",
        "scale-down": "scale-down 0.2s ease-out",
        "liquid-pour": "liquid-pour 1s ease-in-out forwards",
        "liquid-fill-1": "liquid-fill-1 1s ease-out forwards",
        "ice-fall": "ice-fall 0.5s ease-in forwards",
        "liquid-pour-2": "liquid-pour-2 2s ease-in-out forwards",
        "liquid-fill-2": "liquid-fill-2 2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
