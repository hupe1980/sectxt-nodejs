import type { APIGatewayProxyHandler } from "aws-lambda";
import { SecurityTxt } from "sectxt";

export const handler: APIGatewayProxyHandler = async () => {
  const securityTxt = new SecurityTxt({
    contacts: ["mailto:security@example.org"],
    expires: new Date("2022-12-31"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
  });

  return {
    statusCode: 200,
    headers: securityTxt.headers,
    body: securityTxt.render(),
  };
};
