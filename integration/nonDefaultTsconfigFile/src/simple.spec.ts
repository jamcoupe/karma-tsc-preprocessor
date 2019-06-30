import { Simple } from './simple';

describe('Simple', (): void => {
  it("should return 'non default tsconfig file'", (): void => {
    const simple = new Simple();

    const result = simple.getNonDefaultConfigFile();

    expect(result).toBe('non default tsconfig file');
  });
});
