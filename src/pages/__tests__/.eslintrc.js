module.exports = {
    plugins: ["jest"],
    rules: {
        "testing-library/no-node-access": ["error", { "allowContainerFirstChild": true }]
    },
    overrides: [{
        "files": ["__tests__/**/*.spec.tsx"],
        extends: ['plugin:testing-library/react'],
    }]
};

describe("", () => {
    it("", () => { })
})