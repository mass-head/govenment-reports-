/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#344B40',
          secondary: '#788C7E',
          bg: '#F5F6F3',
          card: '#FFFFFF',
          text: '#252C28',
          subtext: '#747D76',
          border: '#E3E7E2',
          hover: '#EDF1EC',
        },
        status: {
          pending: {
            bg: '#FEF3C7',
            text: '#92400E',
            border: '#FDE68A'
          },
          progress: {
            bg: '#E0F2FE',
            text: '#0369A1',
            border: '#BAE6FD'
          },
          resolved: {
            bg: '#DCFCE7',
            text: '#15803D',
            border: '#BBF7D0'
          },
          rejected: {
            bg: '#FEE2E2',
            text: '#B91C1C',
            border: '#FECACA'
          },
          reopened: {
            bg: '#F3E8FF',
            text: '#6B21A8',
            border: '#E9D5FF'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        button: '8px',
        input: '8px',
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        content: '1120px',
      },
    },
  },
  plugins: [],
}
