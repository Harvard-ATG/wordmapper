var webpackTestConfig = require('./webpack.test.config.js');

module.exports = function(config) {
  config.set({
    // Relative to the __dirname of this config file
    // Used for specifying the "files" 
    basePath: '',

    files: [
      // each file acts as entry point for the webpack configuration
      //'wordmapper/client/test/**/*.spec.js'
      'wordmapper/client/test/index.js'
    ],

    preprocessors: {
      // add webpack as preprocessor for each test file
      // also add coverage so we can get test coverage of each webpack bundle
      //'wordmapper/client/test/**/*.spec.js': ['webpack', 'coverage']
      'wordmapper/client/test/index.js': ['webpack', 'coverage']
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
    
    webpack: webpackTestConfig 

  });
};
