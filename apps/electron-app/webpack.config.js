const path = require('path');

module.exports = {
  mode: 'development', // or 'production' as needed
  target: 'electron-renderer',
  entry: './src/renderer.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
  },
};
