const {
  removeGitKeep
} = require('../utils/removeGitKeep')
const {
  getAddAction
} = require('../utils/actions.js')
const {
  share,
  component
} = require('../utils/prompts.js')

const TYPE = 'component'

const getPrompts = plopConfig => {
  const prompts = []

  prompts.push(share.getNamePrompt(plopConfig, TYPE))
  prompts.push(share.getStoreConnectionPrompt(plopConfig, TYPE))
  prompts.push(share.getStoreModulePrompt(plopConfig, TYPE))
  prompts.push(component.getFunctionPrompt(plopConfig))

  return prompts
}

const getActions = plopConfig => data => {
  const actions = []
  actions.push(
    getAddAction(
      plopConfig.path.component,
      '{{dashCase name}}',
      '{{pascalCase name}}',
      'vue',
      plopConfig.template + '/vue.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.component,
      '{{dashCase name}}',
      '{{dashCase name}}',
      'html',
      plopConfig.template + '/template.html.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.component,
      '{{dashCase name}}',
      '{{dashCase name}}',
      'scss',
      plopConfig.template + '/style.scss.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.component,
      '{{dashCase name}}',
      '{{dashCase name}}',
      'js',
      plopConfig.template + '/script.js.hbs',
      null
    )
  )

  if (data.storeModule) {
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
  }

  removeGitKeep(plopConfig.path.component)

  return actions
}

module.exports = (plop, config) => {
  plop.setGenerator('Component', {
    description: 'Vue Component',
    prompts: getPrompts(config),
    actions: getActions(config)
  })
}
