// eslint.config.js

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [ {
    files: [ '**/*.ts', '**/*.tsx' ],
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json'
        }
    },
    plugins: {
        '@typescript-eslint': typescriptPlugin
    },
    rules: {
        'no-unused-vars': 'off',
        'eqeqeq': [ 'error', 'always' ],
        '@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ],
        '@typescript-eslint/explicit-function-return-type': 'off'
    }
} ];