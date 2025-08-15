import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

import typescriptEslint from '@typescript-eslint/eslint-plugin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([globalIgnores([
    'webpack.config.js',
    'lib',
    'examples/src/diff',
    'examples/dist',
    'src/getLinesToRender.worker.ts'
]), {
    extends: compat.extends('plugin:@typescript-eslint/recommended', 'plugin:react/recommended'),

    plugins: {
        typescriptEslint,
        react,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        globals: {
            ...globals.mocha,
            ...globals.node,
            ...globals.browser,
        },
    },

    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },

    rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-tabs': 'off',
        indent: ['off', 2], // TODO turn this back to error or update when doing lints

        'max-len': ['off'],

        'arrow-body-style': 'off',
    },
}]);
