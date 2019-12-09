module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ["eslint:recommended", "prettier"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react"],
    rules: {
        indent: ["error", 2],
        quotes: ["error", "single"],
        semi: ["error", "always"],
        indent: ["error", 2, { "SwitchCase": 1 }]
    }
};
