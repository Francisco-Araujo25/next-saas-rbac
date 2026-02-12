/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable rules that cause React 19 parsing errors
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['node_modules/', '.next/', 'dist/', 'build/', '*.config.*'],
}

