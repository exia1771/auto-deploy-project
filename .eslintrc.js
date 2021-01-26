module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  globals: {
    require: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
    "sourceType": "module"
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // 必须使用分号结束
    'semi': [
      'error',
      'always'
    ],
    'space-before-function-paren': 0,
    'spaced-comment': 0,
    // 允许tab缩进
    'no-tabs': 'off',
    // 关闭===检测
    'eqeqeq': 'off',
    // 允许多行空行
    'no-multiple-empty-lines': 'off',
    // 允许多余空格
    'no-trailing-spaces': 'off',
    // end of file last line
    'eol-last': 'off',
    // promise reject不需要error对象
    'prefer-promise-reject-errors': 'off',
    'keyword-spacing': 0,
    'space-before-blocks': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
