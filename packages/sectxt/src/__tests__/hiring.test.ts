import { Hiring } from "../hiring";

describe("hiring", () => {
  test("render web uri value", () => {
    const hiring = new Hiring(["https://secjobs.example.org"]);
    expect(hiring.render()).toEqual("Hiring: https://secjobs.example.org");
  });

  test("render malformed value", () => {
    expect(() => {
      new Hiring(["xyz"]);
    }).toThrowError("Each hiring field must begin with https://.");
  });
});
