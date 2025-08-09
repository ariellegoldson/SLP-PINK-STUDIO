module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pink: 'var(--pink)',
        'pink-600': 'var(--pink-600)',
        text: 'var(--text)',
        primary: 'var(--pink)'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
}
