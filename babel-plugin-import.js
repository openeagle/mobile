const libraryName = '@openeagle/mobile'
const libraryDirectory = 'src'

const moduleExports = {
  components: ['ImageUploader', 'list', 'Loader', 'NumberText', 'Uploader'],
  hooks: ['useList', 'useRequest', 'useToast'],
  utils: ['createRequest', 'getCurrentProxy'],
}
const moduleMaps = Object.keys(moduleExports).reduce((rcc, key) => {
  moduleExports[key].forEach((item) => {
    rcc[item] = key
  })
  return rcc
}, {})
const styles = ['ImageUploader', 'list', 'Loader', 'NumberText', 'Uploader']
  .map((name) => `${libraryName}/${libraryDirectory}/components/${name}`)
  .reduce((rcc, name) => {
    rcc[name] = true
    return rcc
  }, {})

module.exports = {
  libraryName,
  camel2DashComponentName: false,
  customName: (name) => {
    if (moduleMaps[name]) {
      return `${libraryName}/${libraryDirectory}/${moduleMaps[name]}/${name}`
    }
    return `${libraryName}/${libraryDirectory}/${name}`
  },
  style: (name) => {
    if (styles[name]) {
      return `${name}/style`
    }
    return false
  },
}
