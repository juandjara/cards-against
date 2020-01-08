const path = require('path')
const fs = require('fs')

/**
 * Remove .GitKeep
 */

const removeGitKeep = dir => {
  const gitkeepPath = path.resolve(dir, '.gitkeep')

  if (fs.existsSync(gitkeepPath)) {
    fs.unlinkSync(gitkeepPath)
  }
}

module.exports = {
  removeGitKeep
}
