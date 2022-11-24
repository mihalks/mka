module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  ignorePatterns: ['.eslintrc.js', 'react-app-env.d.ts'],
  rules: {
    'no-param-reassign': ['error'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'linebreak-style': 0,
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    curly: ['error', 'all'],
    'no-implicit-coercion': ['error'],
    'spaced-comment': ['error', 'always'],
    eqeqeq: ['error', 'always'],
    'prefer-template': 'error',
    'no-useless-concat': 'error',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'src/**',
            group: 'parent',
            position: 'after',
          },
        ],
      },
    ],
    'import/newline-after-import': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: ['enumMember', 'variable'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        modifiers: ['unused'],
      },
      {
        selector: 'objectLiteralProperty',
        filter: {
          // Regular expression for BEM classnames
          // Source: https://medium.com/takeaway-tech/the-search-for-a-regex-to-match-hyphenated-bem-css-class-names-5f8b66cc2bd9
          regex: '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
          match: true,
        },
        format: null,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'typeProperty',
        format: ['snake_case', 'camelCase'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
