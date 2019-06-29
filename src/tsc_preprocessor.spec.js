const fs = require("fs");
const path = require("path");
const getTypescriptCompiler = require("./get_typescript_compiler");
const tscPreprocessor = require("./tsc_preprocessor");

jest.mock("fs");
jest.mock("path");
jest.mock("./get_typescript_compiler");

const DEFAULT_TSCONFIG = {
  compilerOptions: {
    module: "commonjs",
    target: "es5",
    sourceMap: true,
  },
};

function createTsMock() {
  return {
    parseConfigFileTextToJson: jest.fn().mockImplementation(() => {}),
    convertCompilerOptionsFromJson: jest.fn().mockImplementation(() => {}),
    transpileModule: jest.fn().mockImplementation(() => {}),
  }
}

function createLoggerMock() {
  const log = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  const logger = {
    create: jest.fn().mockImplementation(() => log),
  };

  return {log, logger};
}


describe("tscPreprocessor", () => {

  it("inject the logger", () => {
    expect(tscPreprocessor.$inject).toContain("logger");
  });

  it("inject the basePath", () => {
    expect(tscPreprocessor.$inject).toContain("config.basePath");
  });

  it("inject the tsc config", () => {
    expect(tscPreprocessor.$inject).toContain("config.tsc");
  });

  describe("when creating the tsc preprocessor", () => {

    const fakeTsConfigFile = "{}";
    const fakeTsConfigParsedCompilerOptionsObject = {};
    const fakeTsConfigParsedConfigObject = {compilerOptions: fakeTsConfigParsedCompilerOptionsObject};
    const fakeTsConfigOptionsObject = {fake: "tsconfig object"};
    const fakeTsConfigObject = {options: fakeTsConfigOptionsObject};
    const fakeTsConfigParsedObject = {config: fakeTsConfigParsedConfigObject};
    const basePath = "basePath";

    let log, logger, ts;

    beforeEach(() => {
      ts = createTsMock();
      ({log, logger} = createLoggerMock());
      path.resolve.mockImplementation((...args) => args.join("-"));

      fs.readFileSync.mockReturnValue(fakeTsConfigFile);
      ts.convertCompilerOptionsFromJson.mockReturnValue(fakeTsConfigObject);
      ts.parseConfigFileTextToJson.mockReturnValue(fakeTsConfigParsedObject);
      ts.transpileModule.mockReturnValue({});

      getTypescriptCompiler.mockImplementation(() => ts);

    });

    it("should create a logger", () => {
      tscPreprocessor(logger, basePath);

      expect(logger.create).toHaveBeenCalledWith("karma-tsc-preprocessor");
    });

    it("should get the typescript compiler passing in the log object", () => {
      tscPreprocessor(logger, basePath);

      expect(getTypescriptCompiler).toHaveBeenCalledWith(log, expect.any(Function));
    });

    describe("when no tsc options are passed", () => {

      it("should try to resolve tsconfig.json using the the base path", () => {
        tscPreprocessor(logger, basePath);

        expect(path.resolve).toHaveBeenCalledWith(basePath, "tsconfig.json");
      });
    });

    describe("when tsc options contain a configFile", () => {

      const nonDefaultConfigPath = "tsconfig.nondefault.json";

      it("should try to resolve the configFile value using the the base path", () => {
        tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

        expect(path.resolve).toHaveBeenCalledWith(basePath, nonDefaultConfigPath);
      });

      describe("and the file exists", () => {

        beforeEach(() => {
          fs.existsSync.mockReturnValue(true);
        });

        it("should read the file", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(fs.readFileSync).toHaveBeenCalledWith(`${basePath}-${nonDefaultConfigPath}`, {encoding: "utf8"});
        });

        it("should parse the read config file", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(ts.parseConfigFileTextToJson).toHaveBeenCalledWith(nonDefaultConfigPath, fakeTsConfigFile);
        });

        it("should convert the parsed json options", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(ts.convertCompilerOptionsFromJson).toHaveBeenCalledWith(fakeTsConfigParsedCompilerOptionsObject);
        });

        it("should log a debug message", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(log.debug).toHaveBeenCalledWith(`transpiling with options:\n${JSON.stringify(fakeTsConfigOptionsObject, null, "  ")}`);
        });

        it("should return a function", () => {
          const result = tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(typeof result).toBe("function");
        });
      });

      describe("and the file does not exist", () => {

        beforeEach(() => {
          fs.existsSync.mockReturnValue(false);
        });

        it("should log an error with the file path", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(log.error).toHaveBeenCalledWith(`could not find ${basePath}-${nonDefaultConfigPath} using a default config:\n${JSON.stringify(DEFAULT_TSCONFIG, null, "  ")}`);
        });

        it("should convert the parsed json options", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(ts.convertCompilerOptionsFromJson).toHaveBeenCalledWith(DEFAULT_TSCONFIG.compilerOptions);
        });

        it("should log a debug message", () => {
          tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(log.debug).toHaveBeenCalledWith(`transpiling with options:\n${JSON.stringify(fakeTsConfigOptionsObject, null, "  ")}`);
        });

        it("should return a function", () => {
          const result = tscPreprocessor(logger, basePath, {configFile: nonDefaultConfigPath});

          expect(typeof result).toBe("function");
        });
      });
    });

    describe("when tsc options contain compilerOptions", () => {

      it("should convert the options", () => {
        tscPreprocessor(logger, basePath, DEFAULT_TSCONFIG);

        expect(ts.convertCompilerOptionsFromJson).toHaveBeenCalledWith(DEFAULT_TSCONFIG.compilerOptions);
      });

      it("should log a debug message", () => {
        tscPreprocessor(logger, basePath, DEFAULT_TSCONFIG);

        expect(log.debug).toHaveBeenCalledWith(`transpiling with options:\n${JSON.stringify(fakeTsConfigOptionsObject, null, "  ")}`);
      });

      it("should return a function", () => {
        const result = tscPreprocessor(logger, basePath, DEFAULT_TSCONFIG);

        expect(typeof result).toBe("function");
      });
    });

    describe("when calling the preprocessor function", () => {

      let preprocessorFn;
      let file;
      const fileContent = "class TsFileLike {}\n//# sourceMappingURL=blah.js.map";
      const originalPath = "some-typescript-file.ts";
      const somePath = "path";
      const transpileResult = {
        outputText: fileContent
      };
      const doneFn = jest.fn();

      beforeEach(() => {
        file = {originalPath, path: somePath};
        preprocessorFn = tscPreprocessor(logger, basePath, DEFAULT_TSCONFIG);
      });

      it("should log a debug message with the file name", () => {
        preprocessorFn(fileContent, file, doneFn);

        expect(log.debug).toHaveBeenCalledWith(`transpiling: ${originalPath}`);
      });

      it("should transpile the file content using the converted options", () => {
        preprocessorFn(fileContent, file, doneFn);

        expect(ts.transpileModule).toHaveBeenCalledWith(fileContent, {compilerOptions: fakeTsConfigOptionsObject, fileName: originalPath});
      });

      it("should set the path property on the file object with .ts replaced with .js", () => {
        preprocessorFn(fileContent, file, doneFn);

        expect(file.path).toBe("some-typescript-file.js");
      });

      describe("when a transpile results in a source map", () => {

        const sourceMapText = '{"a": 1, "sources": []}';

        beforeEach(() => {
          path.basename.mockImplementation((base) => `basename:${base}`);
          ts.transpileModule.mockReturnValue({outputText: transpileResult.outputText, sourceMapText});
        });

        it("should set an source map on the file object", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(file.sourceMap).toBeDefined();
        });

        it("should get the basename of the original path", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(path.basename).toHaveBeenCalledWith(originalPath);
        });

        it("should set the result from the basename of the original path as the first source", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(file.sourceMap.sources[0]).toBe(`basename:${originalPath}`)
        });

        it("should have source content contain the original ts file", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(file.sourceMap.sourcesContent).toEqual([fileContent])
        });

        it("should get the basename of the path on the file object", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(path.basename).toHaveBeenCalledWith(file.path);
        });

        it("should set the result from the basename of the path on the file object as the source file", () => {
          preprocessorFn(fileContent, file, doneFn);

          expect(file.sourceMap.file).toBe(`basename:${file.path}`)
        });


        it("should call the done function with the transpile result text with the source map replaced with an inline version", () => {
          preprocessorFn(fileContent, file, doneFn);

          const inlineSourceMap = `data:application/json;charset=utf-8;base64,${new Buffer(JSON.stringify(file.sourceMap)).toString('base64')}`
          const result = transpileResult.outputText.replace("blah.js.map", inlineSourceMap);
          expect(doneFn).toHaveBeenCalledWith(null, result);
        });
      });

      it("should call the done function with the transpile result text", () => {
        ts.transpileModule.mockReturnValue(transpileResult);

        preprocessorFn(fileContent, file, doneFn);

        expect(doneFn).toHaveBeenCalledWith(null, transpileResult.outputText);
      });
    });
  });
});
