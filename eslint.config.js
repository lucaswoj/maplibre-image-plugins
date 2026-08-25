import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {ignores: ['bench/plugins.mjs', 'dist', 'docs/plugins.mjs', 'docs/chunks', 'docs/vendor']},
    js.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {parserOptions: {projectService: true, tsconfigRootDir: import.meta.dirname}},
        rules: {
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/restrict-template-expressions': ['error', {allowNumber: true}],
        },
    },
    {files: ['**/*.js'], extends: [tseslint.configs.disableTypeChecked]},
    {
        files: ['bench/**/*.js', 'docs/**/*.js'],
        languageOptions: {
            globals: {
                URLSearchParams: 'readonly',
                document: 'readonly',
                location: 'readonly',
                performance: 'readonly',
                setInterval: 'readonly',
                setTimeout: 'readonly',
                window: 'readonly',
            },
        },
    },
);
