const defaultConfig = require('./config')
const {
  init
} = require('./utils/init')
const componentGenerator = require('./generator/component.generator')
const viewGenerator = require('./generator/view.generator')
const storeGenerator = require('./generator/store.generator')

module.exports = (plop, config) => {
  const currentConfig = Object.assign(defaultConfig, config || {})

  init(currentConfig.path)
  componentGenerator(plop, currentConfig)
  viewGenerator(plop, currentConfig)
  storeGenerator(plop, currentConfig)
}
