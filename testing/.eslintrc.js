module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        mocha:true,
        'cypress/globals': true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        'plugin:cypress/recommended',
    ],
    overrides: [
        {
            files: ['**/*.spec.js'], // Adjust the file pattern as needed
            env: {
                jest: true,
                mocha: true,
                'cypress/globals': true,// Add the mocha environment for test-related globals
            },
            globals: {
                cy: true, // Define Cypress globals here
                describe: true, // Define 'describe' as a global
                beforeEach: true, // Define 'beforeEach' as a global
                afterEach: true, // Define 'afterEach' as a global
                it: true, // Define 'it' as a global // Define 'beforeEach' as a global
            },
            plugins: ['cypress'],
        },
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.js', '.eslintrc.cjs'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react','cypress'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    "rules": {
    }
}
