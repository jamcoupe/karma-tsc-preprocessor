const getTypescriptCompiler = require('./get_typescript_compiler');

const TS_VERSION = '0.0.0';

function createLogMock() {
  return {
    info: jest.fn(),
    error: jest.fn(),
  };
}

describe('getTypescriptCompiler', () => {
  let log;
  let requireMock;

  beforeEach(() => {
    requireMock = jest.fn();
    log = createLogMock();
  });

  describe('when the typescript module can be resolved', () => {
    const typescriptModule = { version: TS_VERSION };

    beforeEach(() => {
      requireMock.mockReturnValue(typescriptModule);
    });

    it('should log an info message about the version that was resolved', () => {
      getTypescriptCompiler(log, requireMock);

      expect(log.info).toHaveBeenCalledWith(`using typescript@${TS_VERSION}`);
    });

    it('should return the module', () => {
      const result = getTypescriptCompiler(log, requireMock);

      expect(result).toBe(typescriptModule);
    });
  });

  describe('when the typescript module can not be resolved', () => {
    const errorMessage = 'Some node.js require error';

    beforeEach(() => {
      requireMock.mockImplementation(() => {
        throw new Error(errorMessage);
      });
    });

    it('should throw the original error and log an error', () => {
      const willThrow = () => getTypescriptCompiler(log, requireMock);

      expect(willThrow).toThrowError(errorMessage);
      expect(log.error).toHaveBeenCalledWith('typescript peer dependency can not be found...');
    });
  });
});
