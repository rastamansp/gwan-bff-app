const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@workers': path.resolve(__dirname, 'src/workers')
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}; 