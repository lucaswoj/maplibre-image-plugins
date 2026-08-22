import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({ignores: ['node_modules']}, tseslint.configs.strict, tseslint.configs.stylistic, {
    rules: {'@typescript-eslint/consistent-type-definitions': ['error', 'type']},
});
