const fs = require('fs')

const init = path => {
  Object.values(path).forEach(p => {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  })
}

module.exports = {
  init
}
