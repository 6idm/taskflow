const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  // Dossiers que ESLint ignore
  { ignores: ['node_modules/', 'coverage/', 'dist/'] },

  // Règles recommandées par ESLint
  js.configs.recommended,

  // Code serveur (Node, CommonJS) : tout sauf public/
  {
    files: ['**/*.js'],
    ignores: ['public/**'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  // Code front (navigateur) : public/
  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },

  // Nos règles
  {
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Doit rester en dernier : désactive les règles de style qui gênent Prettier
  prettier,
];
