// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const extraNodeModules = require('node-libs-browser');
const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = extraNodeModules;
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
  babelTransformerPath: require.resolve('react-native-obfuscating-transformer'),
});
module.exports = config;

