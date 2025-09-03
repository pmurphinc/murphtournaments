/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  // Optional: keep it simple. Next 14 works fine with this.
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
