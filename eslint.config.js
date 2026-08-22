import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {ignores: ['bench/plugins.mjs']},
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
        files: ['bench/**/*.js'],
        languageOptions: {
            globals: {
                URLSearchParams: 'readonly',
                location: 'readonly',
                performance: 'readonly',
                setTimeout: 'readonly',
                window: 'readonly',
            },
        },
    },
);
