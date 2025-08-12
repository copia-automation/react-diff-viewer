import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("airbnb-base", "plugin:@typescript-eslint/recommended"),

    languageOptions: {
        globals: {
            ...globals.mocha,
            ...globals.node,
            ...globals.browser,
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },

    rules: {
        "no-tabs": "off",
        "indent": ["off", 2], //TODO turn this back to error or update when doing lints

        "max-len": ["off"],

        "arrow-body-style": "off",
    },
}]);