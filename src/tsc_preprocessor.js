const fs = require("fs");
const path = require("path");
const getTypescriptCompiler = require("./get_typescript_compiler");

const DEFAULT_OPTIONS = {
  compilerOptions: {
    module: "commonjs",
    target: "es5",
    sourceMap: true,
  },
};

function tscPreprocessor(
  logger,
  basePath,
  configTsc,
) {
  const log = logger.create("karma-tsc-preprocessor");
  const ts = getTypescriptCompiler(log, require);
  let config = configTsc || {configFile: "tsconfig.json"};
  let jsonConfig;

  if (config.configFile) {
    const configFilePath = path.resolve(basePath, config.configFile);

    if (fs.existsSync(configFilePath)) {
      const configFileString = fs.readFileSync(configFilePath, {encoding: "utf8"});
      jsonConfig = ts.parseConfigFileTextToJson(config.configFile, configFileString).config;
    } else {
      jsonConfig = DEFAULT_OPTIONS;
      log.error(`could not find ${configFilePath} using a default config:\n${JSON.stringify(DEFAULT_OPTIONS, null, "  ")}`);
    }
  } else {
    jsonConfig = config
  }

  const resolvedCompilerOptions = ts.convertCompilerOptionsFromJson(jsonConfig.compilerOptions).options;

  log.debug("transpiling with options:\n" + JSON.stringify(resolvedCompilerOptions, null, "  "));

  return function(content, file, done) {
    log.debug("transpiling: " + file.originalPath);
    const compiledFile = ts.transpileModule(content, {compilerOptions: resolvedCompilerOptions, fileName: file.originalPath});
    file.path = file.originalPath.replace(/\.ts$/, ".js");
    let outputFile = compiledFile.outputText;

    if (compiledFile.sourceMapText) {
      const map = JSON.parse(compiledFile.sourceMapText);
      map.sources[0] = path.basename(file.originalPath);
      map.sourcesContent = [content];
      map.file = path.basename(file.path);
      file.sourceMap = map;
      const datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64');
      outputFile = outputFile.replace(/\/\/# sourceMappingURL=[\w.]+/g, `//# sourceMappingURL=${datauri}`); // Remove original file mapping and inline
    }

    done(null, outputFile);
  };
}
tscPreprocessor.$inject = [
  "logger",
  "config.basePath",
  "config.tsc",
];

module.exports = tscPreprocessor;
