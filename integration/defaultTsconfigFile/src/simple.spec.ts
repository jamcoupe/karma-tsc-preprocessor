import { Simple } from './simple';

describe('Simple', (): void => {
  it("should return 'default config file'", (): void => {
    const simple = new Simple();

    const result = simple.getDefaultTsConfigFileText();

    expect(result).toBe('default config file');
  });
});
