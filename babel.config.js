module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      // If you use plugin-transform-private-property-in-object, configure it as well
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ],
  };
};
