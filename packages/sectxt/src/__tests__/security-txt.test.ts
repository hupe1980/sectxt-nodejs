import express from "express";
import request from "supertest";

import { SecurityTxt } from "../security-txt";

describe("security-txt", () => {
  test("middleware response", async () => {
    expect.assertions(3);

    const securityTxt = new SecurityTxt({
      contacts: ["mailto:security@example.org"],
      expires: new Date("2019-01-16"),
    });

    const app = express();
    app.use(securityTxt.middleware());
    const response = await request(app).get(securityTxt.path);

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe(
      securityTxt.headers["content-type"]
    );
    expect(response.text).toBe(securityTxt.render());
  });

  test("middleware redirect", async () => {
    expect.assertions(2);

    const pathAlternative = "/security.txt";

    const securityTxt = new SecurityTxt({
      pathAlternative,
      contacts: ["mailto:security@example.org"],
      expires: new Date("2019-01-16"),
    });

    const app = express();
    app.use(securityTxt.middleware());
    const redirect = await request(app).get(pathAlternative);

    expect(redirect.statusCode).toBe(301);
    expect(redirect.headers["location"]).toBe(securityTxt.path);
  });
});
