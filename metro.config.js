// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ✅ Allow Firebase SDK to resolve `.cjs` files
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// ✅ Disable strict export maps to avoid errors with Firebase
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
