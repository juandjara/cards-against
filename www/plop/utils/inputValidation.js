const fs = require('fs')

const validateNameInput = (folderPath, type) => value => {
  if (/.+/.test(value)) {
    return componentExists(value, folderPath)
      ? `A ${type} with this name already exist`
      : true
  }
  return 'The name is required'
}

const getComponents = directoryPath => {
  return fs.readdirSync(directoryPath)
}

const componentExists = (component, directoryPath) => {
  const components = getComponents(directoryPath)
  return componentsContain(components, component)
}

const componentsContain = (components, component) => {
  return components.indexOf(component) >= 0
}

module.exports = {
  validateNameInput
}
