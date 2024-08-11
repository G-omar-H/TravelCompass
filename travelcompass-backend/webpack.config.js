const path = require('path');

module.exports = {
  entry: './index.js', // Your application's entry point
  output: {
    filename: 'bundle.js', // Output bundle filename
    path: path.resolve(__dirname, 'dist') // Output directory
  },
  mode: 'production' // Set to 'development' for development builds
};
