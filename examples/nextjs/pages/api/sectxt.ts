import type { NextApiRequest, NextApiResponse } from "next";
import { SecurityTxt } from "sectxt";

const securityTxt = new SecurityTxt({
  contacts: ["mailto:security@example.org"],
  expires: new Date("2022-12-31"),
  preferredLanguages: ["en", "de"],
  hiring: ["https://secjobs.example.org"],
});

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  res.status(200);
  for (const [key, value] of Object.entries(securityTxt.headers)) {
    res.setHeader(key, value);
  }
  res.send(await securityTxt.render());
}
