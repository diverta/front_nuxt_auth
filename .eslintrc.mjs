module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
    plugins: ['unused-imports'],
    rules: {
        // NOTE: https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_'
            }
        ],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
    }
};
