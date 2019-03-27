module.exports = {
  extends: [
    'standard',
    'standard-react',
    'typescript',
    'typescript/react',
    'plugin:jest/recommended'
  ],
  plugins: ['react-hooks', 'filenames'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    jsx: true,
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': 'warn',
    'jest/no-jest-import': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-var-requires': 'off'
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'jest/no-jest-import': 'error'
      }
    },
    {
      files: ['*.ts', '*.tsx', '*.mjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'error'
      }
    }
  ]
}
