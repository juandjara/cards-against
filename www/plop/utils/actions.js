const getAddAction = (
  rootPath,
  destPath,
  fileName,
  extFile = 'js',
  templateFile,
  additionalConfig
) => {
  const action = {
    type: 'add',
    path: `${rootPath}/${destPath}/${fileName}.${extFile}`,
    templateFile: templateFile,
    abortOnFail: true
  }
  if (additionalConfig) {
    action['data'] = additionalConfig
  }
  return action
}

module.exports = {
  getAddAction
}
