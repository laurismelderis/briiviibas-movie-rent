module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
    },
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    rules: {
        curly: 'error',
        indent: ['error', 4],
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', {
            objects: 'always-multiline',
        }],
        'no-unused-vars': 'warn',
    },
}
