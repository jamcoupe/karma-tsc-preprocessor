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
      compilerOptions: {
        module: 'commonjs',
        target: 'es6',
        sourceMap: true,
      },
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
