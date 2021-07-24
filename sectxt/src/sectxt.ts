import { SecurityTxt, SecurityTxtOptions, Middleware } from "./security-txt";

export const sectxt = (options: SecurityTxtOptions): Middleware => {
  const securityTxt = new SecurityTxt(options);
  return securityTxt.middleware();
};
