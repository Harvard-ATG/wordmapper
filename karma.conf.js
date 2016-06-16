var webpackConfig = require('./webpack.config.js');

// Override the default entry point for the webpack bundle
// because each test file will act as an entry point instead.
// Note: must set to an empty object, null won't work.
webpackConfig.entry = {}; 

module.exports = function(config) {
  config.set({
    // Relative to the __dirname of this config file
    // Used for specifying the "files" 
    basePath: '',

    files: [
      // each file acts as entry point for the webpack configuration
      'wordmapper/client/test/**/*.spec.js'
    ],

    preprocessors: {
      // add webpack as preprocessor for each test file
      'wordmapper/client/test/**/*.spec.js': ['webpack'],
      
      // add coverage preprocessor for src files
      'wordmapper/client/src/**/*.js': ['coverage']
    },

    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-html-reporter', // see localhost:9876/debug.html
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-webpack'
    ],
    
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    reporters: ['mocha', 'kjhtml', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    },

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
