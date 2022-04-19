const libraryName = '@openeagle/mobile'

const components = ['ImageUploader', 'list', 'Loader', 'NumberText', 'Uploader']

module.exports = {
  ensureStyleFile: true,
  esModule: true,
  libraryName,
  libraryNameChangeCase: 'pascalCase',
  resolveStyle: (name) => {
    if (components.includes(name)) {
      return `${libraryName}/es/components/${name}/style/index`
    }
    return false
  },
}
