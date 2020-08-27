module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    [
      "module-resolver",
      {
        alias: {
          "@src": "./src",
          "@test": "./test",
        },
      },
    ],
  ],
  ignore: ["**/*.test.ts"],
};
