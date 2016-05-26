// Karma configuration
// Reference: https://www.youtube.com/watch?v=3D7o9BQHY7Q

module.exports = function(config) {
  config.set({

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // karma-babel-preprocessor settings
    // tell it to use babel-preset-es2015
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS'
    ],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // list of files to exclude
    exclude: [],

    // list of files / patterns to load in the browser
    files: [
      'lib/assets/**/*.js'
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'jspm',
      'jasmine',
      'sinon-chrome'
    ],

    jspm: {
      config: 'config.js',
      packages: 'jspm_packages/',
      loadFiles: [
        'test/**/*.js'
      ],
      serveFiles: [
        'lib/scripts/**/*.js'
      ]
    },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    plugins: [
      'karma-babel-preprocessor',
      'karma-jasmine',
      'karma-jspm',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sinon-chrome',
      'karma-chrome-launcher'
    ],

    // web server port
    port: 9000,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'lib/scripts/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },

    // set up proxies so the test server will be able to find our files
    proxies: {
      '/lib/': '/base/lib/',
      '/jspm_packages/': '/base/jspm_packages/',
      '/test/': '/base/test/',
      '/services/': '/base/lib/scripts/services/',
      '/utils/' : '/base/lib/scripts/utils/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'spec'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // set up the spec reporter - I just want to see the "expected x to equal y" output in errors
    specReporter: {
      maxLogLines: 1,
      suppressErrorSummary: true,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: false
    }
  });
};
