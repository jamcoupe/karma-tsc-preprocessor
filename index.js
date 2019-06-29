const tscPreprocessor = require("./src/tsc_preprocessor");

module.exports = {
  "preprocessor:tsc": ["factory", tscPreprocessor]
};
