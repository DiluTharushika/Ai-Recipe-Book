// ✅ babel.config.js: tells Babel how to compile your code
module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // ✅ This plugin is required for react-native-reanimated to work properly
        'react-native-reanimated/plugin',
      ],
    };
  };
  