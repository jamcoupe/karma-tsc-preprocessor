import { Simple } from './simple';

describe('Simple', (): void => {
  it("should return 'old tsc'", (): void => {
    const simple = new Simple();

    const result = simple.getOldTsc();

    expect(result).toBe('old tsc');
  });
});
