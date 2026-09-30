module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@react-native/babel-plugin-codegen',
        {
          outputDir: './@react-native',
        },
      ],
    ],
    overrides: [
      {
        test: /DebuggingOverlayNativeComponent\.js$/,
        plugins: [],
      },
    ],
  };
};
