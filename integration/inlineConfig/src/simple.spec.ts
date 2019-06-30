import { Simple } from './simple';

describe('Simple', (): void => {
  it("should return 'inline config'", (): void => {
    const simple = new Simple();

    const result = simple.getInlineConfig();

    expect(result).toBe('inline config');
  });
});
