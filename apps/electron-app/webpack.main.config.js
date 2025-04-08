const path = require('path');

module.exports = {
  mode: 'development',
  target: 'electron-main',
  entry: './src/main.ts',
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
  // IMPORTANT: Exclude ffmpeg-static from being bundled.
  externals: {
    'ffmpeg-static': 'commonjs ffmpeg-static'
  },
  // Preserve __dirname for proper path resolution.
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
