import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f2f6ee',
          100: '#e1ebd7',
          200: '#c5d8b2',
          300: '#a2bf87',
          400: '#82a962',
          500: '#658f47',
          600: '#4e7136',
          700: '#3d582c',
          800: '#334826',
          900: '#2c3e22'
        },
        spore: {
          50: '#fbf7f2',
          100: '#f4e9db',
          200: '#e6cdae',
          300: '#d6ac7c',
          400: '#c88d54',
          500: '#b8733a',
          600: '#9c5b2e',
          700: '#7d4728',
          800: '#663b25',
          900: '#563121'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
}
