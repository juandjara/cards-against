const { validateNameInput } = require('./inputValidation.js')

// Share Propmpt's
const getNamePrompt = (plopConfig, type) => {
  const defaultName = plopConfig.defaultName[type]
  const defaultFolderPath = plopConfig.path[type]

  return {
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: defaultName,
    validate: validateNameInput(defaultFolderPath, type)
  }
}

const getStoreConnectionPrompt = (plopConfig, type) => {
  let defaultResponse

  try {
    defaultResponse = plopConfig.defaultValue[type].storeConnection
  } catch (e) {
    defaultResponse = false
  }

  return {
    type: 'confirm',
    name: 'storeConnection',
    message: 'Do you want that has the store connection?',
    default: defaultResponse
  }
}

const getStoreModulePrompt = (plopConfig, type) => {
  let defaultResponse

  try {
    defaultResponse = plopConfig.defaultValue[type].storeModule
  } catch (e) {
    defaultResponse = false
  }

  return {
    type: 'confirm',
    name: 'storeModule',
    message: 'Do you want that has a store module?',
    default: defaultResponse
  }
}

// Component Propmpt's
const getFunctionPrompt = plopConfig => {
  let defaultResponse

  try {
    defaultResponse = plopConfig.defaultValue.component.functional
  } catch (e) {
    defaultResponse = false
  }

  return {
    type: 'confirm',
    name: 'functional',
    message: 'Do you want a functional component?',
    default: defaultResponse
  }
}

// View Propmpt's
const getLazyPrompt = plopConfig => {
  let defaultResponse

  try {
    defaultResponse = plopConfig.defaultValue.view.lazy
  } catch (e) {
    defaultResponse = false
  }

  return {
    type: 'confirm',
    name: 'lazy',
    message: 'Do you want lazy load to the view?',
    default: defaultResponse
  }
}

module.exports = {
  share: {
    getNamePrompt,
    getStoreConnectionPrompt,
    getStoreModulePrompt
  },
  component: {
    getFunctionPrompt
  },
  view: {
    getLazyPrompt
  }
}
