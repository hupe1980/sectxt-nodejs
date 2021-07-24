import { Canonical } from "../canonical";

describe("canonical", () => {
  test("render web uri value", () => {
    const canonical = new Canonical(["https://example.org"]);
    expect(canonical.render()).toEqual("Canonical: https://example.org");
  });

  test("render malformed value", () => {
    expect(() => {
      new Canonical(["xyz"]);
    }).toThrowError("Each cononical field must begin with https://.");
  });
});
