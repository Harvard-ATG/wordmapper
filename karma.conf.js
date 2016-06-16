module.exports = function(config) {
  config.set({
    // Relative to the __dirname of this config file
    // Used for specifying the "files" 
    basePath: 'wordmapper',

    files: [
      'client/test/**/*.spec.js'
    ],

    plugins: [
      'karma-jasmine',
      'karma-jasmine-html-reporter', // see localhost:9876/debug.html
      'karma-mocha-reporter',
      'karma-phantomjs-launcher'
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
    }

  });
}
