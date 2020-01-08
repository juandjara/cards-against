const {
  removeGitKeep
} = require('../utils/removeGitKeep')
const {
  getAddAction
} = require('../utils/actions.js')
const {
  share
} = require('../utils/prompts.js')

const TYPE = 'store'

const getPrompts = plopConfig => {
  const prompts = []

  prompts.push(share.getNamePrompt(plopConfig, TYPE))

  return prompts
}

const getActions = plopConfig => data => {
  const actions = []

  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'index',
      'js',
      plopConfig.template + '/store.js.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'state',
      'js',
      plopConfig.template + '/state.js.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'mutations',
      'js',
      plopConfig.template + '/mutations.js.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'getters',
      'js',
      plopConfig.template + '/getters.js.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'actions',
      'js',
      plopConfig.template + '/actions.js.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.store,
      '{{dashCase name}}',
      'constants',
      'js',
      plopConfig.template + '/constants.js.hbs',
      null
    )
  )

  removeGitKeep(plopConfig.path.component)

  return actions
}

module.exports = (plop, config) => {
  plop.setGenerator('Store', {
    description: 'Vue Store',
    prompts: getPrompts(config),
    actions: getActions(config)
  })
}
