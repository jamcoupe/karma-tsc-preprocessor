module.exports = function(config) {
  config.set({
    basePath: '.',
    browsers: ['ChromeHeadless'],
    files: [
      'src/**/*.ts',
    ],
    preprocessors: {
      'src/**/*.ts': ['tsc', 'commonjs'],
    },
    tsc: {
      configFile: 'tsconfig.test.json',
    },
    frameworks: [
      'jasmine',
      'commonjs',
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-commonjs',
      'karma-tsc-preprocessor',
    ],
    singleRun: true,
  });
};
