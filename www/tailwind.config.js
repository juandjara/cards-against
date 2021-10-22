module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    options: {
      // avoid purging classnames built dynamically
      safelist: ['blue', 'red', 'gray', 'green']
        .map((color) => [
          `text-${color}-500`,
          `text-${color}-700`,
          `text-${color}-900`,
          `hover:bg-${color}-200`,
          `bg-${color}-100`,
          `hover:bg-${color}-50`,
          `bg-${color}-50`
        ])
        .flat()
        .concat(['text-left', 'text-right'])
    }
  },
  theme: {
    gridTemplateColumns: {
      'fill-52': 'repeat(auto-fill, 13rem)'
    }
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
      borderColor: ['hover'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringOpacity: ['focus-visible']
    }
  },
  plugins: [require('@tailwindcss/forms')]
  // specify other options here
}
