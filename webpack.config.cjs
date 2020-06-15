path = require('path');

module.exports = {
  entry: './src/geometry.js',
  output: {
    filename: 'geometry.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
