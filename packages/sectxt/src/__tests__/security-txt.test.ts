import express from "express";
import request from "supertest";
import * as openpgp from "openpgp";

import { SecurityTxt } from "../security-txt";
import { privateKeyArmored, publicKeyArmored } from "./gnupg";

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
    expect(response.text).toBe(await securityTxt.render());
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

  test("render", async () => {
    expect.assertions(1);

    const securityTxt = new SecurityTxt({
      intro: "Intro",
      contacts: ["mailto:security@example.org"],
      expires: new Date("2019-01-16"),
      hiring: [{ comment: "Comment", value: "https://secjobs.example.org" }],
      outtro: "Outtro",
    });

    expect(await securityTxt.render()).toBe(`# Intro

Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z
# Comment
Hiring: https://secjobs.example.org

# Outtro`);
  });

  test("sign", async () => {
    expect.assertions(2);

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({
        armoredKey: privateKeyArmored,
      }),
      passphrase: "helloworld",
    });

    const securityTxt = new SecurityTxt({
      privateKey,
      contacts: ["mailto:security@example.org"],
      expires: new Date("2019-01-16"),
    });

    const unsignedSecurityTxt = new SecurityTxt({
      contacts: ["mailto:security@example.org"],
      expires: new Date("2019-01-16"),
    });

    const signedMessage = await openpgp.readCleartextMessage({
      cleartextMessage: await securityTxt.render(),
    });

    const verificationResult = await openpgp.verify({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: signedMessage as any,
      verificationKeys: publicKey,
    });

    expect(verificationResult.data).toBe(await unsignedSecurityTxt.render());

    const { verified } = verificationResult.signatures[0];

    // throws on invalid signature
    expect(async () => await verified).not.toThrow();
  });
});
