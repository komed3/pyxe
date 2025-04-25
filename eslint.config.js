// eslint.config.js

import eslintPluginImport from 'eslint-plugin-import';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [ {
    files: [ '**/*.ts', '**/*.tsx' ],
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json',
        },
    },
    plugins: {
        '@typescript-eslint': typescriptPlugin,
        import: eslintPluginImport,
    },
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ],
        'import/order': [ 'warn', { alphabetize: { order: 'asc' } } ],
    },
} ];