// This config file is used by eslint
// See package.json scripts: lint*
// Rules documentation: https://eslint.org/docs/rules/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    // See https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json
    'standard',
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'arrow-parens': [ 'error', 'as-needed' ],
    'comma-dangle': [ 'error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'never',
    } ],
    eqeqeq: [ 'error', 'smart' ],
    'implicit-arrow-linebreak': [ 'error', 'beside' ],
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [
          { pattern: '#*/**', group: 'internal', position: 'before' },
        ],
        groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling' ],
        'newlines-between': 'never',
        alphabetize: { order: 'asc' },
      },
    ],
    indent: [ 'error', 2, { MemberExpression: 'off' } ],
    'no-var': [ 'error' ],
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': [ 'error', 'properties' ],
    'prefer-arrow-callback': [ 'error' ],
    'prefer-const': [ 'error' ],
  },
  globals: {
    // Mocha globals
    it: 'readonly',
    xit: 'readonly',
    describe: 'readonly',
    xdescribe: 'readonly',
    before: 'readonly',
    beforeEach: 'readonly',
  },
}
