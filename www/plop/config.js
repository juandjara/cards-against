const path = require('path')

function getRealtivePath (...des) {
  const currentWorkspace = process.cwd()

  return path.join(currentWorkspace, ...des)
}

module.exports = {
  path: {
    src: getRealtivePath('src'),
    component: getRealtivePath('src', 'components'),
    view: getRealtivePath('src', 'views'),
    store: getRealtivePath('src', 'store')
  },
  template: getRealtivePath('plop', 'templates'),
  defaultName: {
    component: 'Component',
    view: 'View',
    store: 'Store'
  },
  defaultValue: {
    component: {
      functional: false,
      storeConnection: false,
      storeModule: false
    },
    view: {
      lazy: true,
      storeConnection: false,
      storeModule: false
    }
  }

}
