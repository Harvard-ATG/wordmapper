const webpack_config = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    port: 9876,  // karma web server port
    colors: true,
    files: [
      // each file acts as entry point for the webpack configuration
      //'test/**/*.spec.js'
      'test/index.js'
    ],
    preprocessors: {
      // add webpack as preprocessor for each test file
      // also add coverage so we can get test coverage of each webpack bundle
      //'test/**/*.spec.js': ['webpack', 'coverage']
      'test/index.js': ['webpack']
    },
    reporters: ['progress'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher'
    ],
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine'],
    webpack: webpack_config 
  });
};
