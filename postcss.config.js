module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 2,
      features: {
        'custom-properties': { importFrom: 'app/color.css' },
        'nesting-rules': true,
        'color-functional-notation': true,
        'color-mod-function': { importFrom: 'app/color.css' }
      }
    },
    'cssnano': {
      preset: 'default'
    }
  }
}
