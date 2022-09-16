module.exports = {
  extends: ["eslint:recommended", "plugin:compat/recommended", "plugin:@typescript-eslint/recommended", "plugin:@stencil/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  overrides: [
    {
      files: ["**/*.{ts,tsx}", "**/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.stencil.json"]
      }
    }
  ],
  rules: {
    "@stencil/decorators-style": 0,
    "@stencil/decorators-context": 0,
    "@stencil/element-type": 0,
    "@stencil/no-unused-watch": 0,
    "@stencil/strict-boolean-conditions": 0,
    "@stencil/strict-mutable": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-extra-semi": 0,
    "prettier/prettier": "error"
  }
}
