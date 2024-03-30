import withNuxt from './.nuxt/eslint.config.mjs';
import UnusedImports from 'eslint-plugin-unused-imports';

export default withNuxt({
    plugins: {
        'unused-imports': UnusedImports
    },
    // workarounds for unexpected lint error @see https://github.com/nuxt/eslint/issues/371
    languageOptions: {
        globals: {
            $fetch: 'readonly'
        }
    },
    rules: {
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
        'vue/multi-word-component-names': 'off',
        'vue/no-deprecated-v-on-native-modifier': 'off',
        'vue/no-v-html': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/html-self-closing': 'off',
        'vue/valid-v-slot': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/prefer-ts-expect-error': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn'
    }
});
