const {
  removeGitKeep
} = require('../utils/removeGitKeep')
const {
  getAddAction
} = require('../utils/actions.js')
const {
  share,
  view
} = require('../utils/prompts.js')

const TYPE = 'view'

const getPrompts = plopConfig => {
  const prompts = []

  prompts.push(share.getNamePrompt(plopConfig, TYPE))
  prompts.push(view.getLazyPrompt(plopConfig))
  prompts.push(share.getStoreConnectionPrompt(plopConfig, TYPE))
  prompts.push(share.getStoreModulePrompt(plopConfig, TYPE))

  return prompts
}

const getActions = plopConfig => data => {
  const actions = []
  actions.push(
    getAddAction(
      plopConfig.path.view,
      '{{dashCase name}}',
      '{{pascalCase name}}',
      'vue',
      plopConfig.template + '/vue.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.view,
      '{{dashCase name}}',
      '{{dashCase name}}',
      'html',
      plopConfig.template + '/template.html.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.view,
      '{{dashCase name}}',
      '{{dashCase name}}',
      'scss',
      plopConfig.template + '/style.scss.hbs',
      null
    )
  )
  actions.push(
    getAddAction(
      plopConfig.path.view,
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

  removeGitKeep(plopConfig.path.view)

  return actions
}

module.exports = (plop, config) => {
  plop.setGenerator('View', {
    description: 'Vue View',
    prompts: getPrompts(config),
    actions: getActions(config)
  })
}
