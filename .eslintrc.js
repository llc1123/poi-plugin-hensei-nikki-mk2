module.exports = {
  extends: [
    'react-app',
    'poi-plugin',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
      },
    ],
  },
  settings: {
    react: {
      version: '16.8.0',
    },
  },
}
