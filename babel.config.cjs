// babel.config.cjs
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
      // Add this plugin to handle ES modules syntax if needed
      '@babel/plugin-transform-modules-commonjs'
    ]
  };
  