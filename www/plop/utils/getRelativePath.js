const path = require('path')

const getRelativePath = (...des) => {
  const currentWorkspace = process.cwd()

  return path.join(currentWorkspace, ...des)
}

module.exports = {
  getRelativePath
}
