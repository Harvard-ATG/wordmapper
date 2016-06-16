var webpackConfig = require('./webpack.config.js');

// Override the default entry point for the webpack bundle
// because each test file will act as an entry point instead.
// Can't set this to null, have to set it to an empty object.
webpackConfig.entry = {}; 

module.exports = function(config) {
  config.set({
    // Relative to the __dirname of this config file
    // Used for specifying the "files" 
    basePath: 'wordmapper',

    files: [
      // each file acts as entry point for the webpack configuration
      'client/test/**/*.spec.js'
    ],

    preprocessors: {
      // add webpack as preprocessor for each test file
      'client/test/**/*.spec.js': ['webpack']
    },

    plugins: [
      'karma-jasmine',
      'karma-jasmine-html-reporter', // see localhost:9876/debug.html
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-webpack'
    ],
    
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    reporters: ['mocha', 'kjhtml'],

    mochaReporter: {
      showDiff: true
    },
    
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },
    
    webpack: webpackConfig

  });
}
