// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]], // no jsxImportSource needed on v2
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // MUST be last
    ],
  };
};


