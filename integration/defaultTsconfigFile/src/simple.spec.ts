import { Simple } from "./simple";

describe("Simple", () => {

  it("should return 'simple'", () => {
    const simple = new Simple();

    const result = simple.getText();

    expect(result).toBe("simple");
  });
});
