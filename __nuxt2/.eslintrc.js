module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    rules: {
        semi: ['warn', 'always'],
        indent: ['warn', 4],
        'vue/html-indent': ['warn', 4],
        'vue/no-mutating-props': 'off',
        'no-console': 'off',
        'no-prototype-builtins': 'off',
        'vue/order-in-components': 'off',
        'import/order': 'off',
        'space-before-function-paren': 'off',
        'arrow-parens': ['warn', 'always'],
        'vue/max-attributes-per-line': 'off',
        'vue/no-use-v-if-with-v-for': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'comma-dangle': 'warn',
        'no-multiple-empty-lines': 'warn',
        'vue/comment-directive': 0,
        'vue/no-v-html': 'off',
        'no-case-declarations': 'off',
        'prefer-regex-literals': 'off',
        'vue/valid-v-slot': 'off'
    }
};
