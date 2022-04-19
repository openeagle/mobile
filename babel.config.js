const compile = (esmodule) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        modules: esmodule ? false : 'commonjs',
        useBuiltIns: false,
        targets: 'ios_saf >= 10, chrome >= 49',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        allExtensions: true,
        allowDeclareFields: true,
      },
    ],
  ],
  plugins: [
    ['@vue/babel-plugin-jsx', { mergeProps: false }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
  ],
})

module.exports = {
  env: {
    commonjs: compile(false),
    esmodule: compile(true),
  },
}
