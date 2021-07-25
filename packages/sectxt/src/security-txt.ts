import type { PrivateKey } from "openpgp";
import { IncomingMessage, ServerResponse } from "http";
import { Acknowledgments } from "./acknowledgments";
import { Canonical } from "./canonical";
import { Contact } from "./contact";
import { Encryption } from "./encryption";
import { Expires, DateWithComment } from "./expires";
import { Field, Value, ValueWithComment } from "./field";
import { Hiring } from "./hiring";
import { Intro } from "./intro";
import { Outtro } from "./outtro";
import { Policy } from "./policy";
import {
  PreferredLanguages,
  Tags,
  TagsWithComment,
} from "./preferred-languages";

export type NextFunction = () => void;

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => Promise<void>;

export interface SecurityTxtOptions {
  /**
   * @default /.well-known/security.txt
   */
  readonly path?: string;
  readonly pathAlternative?: string;

  readonly intro?: string;
  readonly outtro?: string;

  readonly privateKey?: PrivateKey;

  /**
   * This field indicates an address that researchers should use for
   * reporting security vulnerabilities such as an email address, a phone
   * number and/or a web page with contact information. The "Contact"
   * field MUST always be present in a "security.txt" file.
   */
  readonly contacts: Value[] | ValueWithComment[];

  /**
   * This field indicates the date and time after which the data contained
   * in the "security.txt" file is considered stale and should not be used.
   */
  readonly expires: Date | DateWithComment;

  /**
   * This field indicates an encryption key that security researchers
   * should use for encrypted communication. Keys MUST NOT appear in this
   * field - instead the value of this field MUST be a URI pointing to a
   * location where the key can be retrieved.
   */
  readonly encryptions?: Value[] | ValueWithComment[];

  /**
   * This field indicates a link to a page where security researchers are
   * recognized for their reports. The page being referenced should list
   * security researchers that reported security vulnerabilities and
   * collaborated to remediate them.
   */
  readonly acknowledgments?: Value[] | ValueWithComment[];

  /**
   * This field can be used to indicate a set of natural languages that
   * are preferred when submitting security reports.
   */
  readonly preferredLanguages?: Tags | TagsWithComment;

  /**
   * This field indicates the canonical URIs where the "security.txt" file
   * is located, which is usually something like "https://example.com/.well-known/security.txt".
   */
  readonly canonical?: Value[] | ValueWithComment[];

  /**
   * This field indicates a link to where the vulnerability disclosure
   * policy is located. This can help security researchers understand the
   * organization's vulnerability reporting practices.
   */
  readonly policy?: Value[] | ValueWithComment[];

  /**
   * The "Hiring" field is used for linking to the vendor's security-
   * related job positions.
   */
  readonly hiring?: Value[] | ValueWithComment[];
}

export class SecurityTxt {
  public readonly path: string;
  public readonly headers: Record<string, string>;
  public readonly pathAlternative?: string;

  private readonly privateKey?: PrivateKey;
  private readonly fields = new Array<Field>();

  private cachedText?: string;

  constructor(options: SecurityTxtOptions) {
    this.path = options.path ?? "/.well-known/security.txt";
    this.headers = {
      "content-type": "text/plain; charset=utf-8",
    };

    this.pathAlternative = options.pathAlternative;

    this.privateKey = options.privateKey;

    if (options.intro) {
      this.fields.push(new Intro(options.intro));
    }

    this.fields.push(new Contact(options.contacts));
    this.fields.push(new Expires(options.expires));

    if (options.encryptions) {
      this.fields.push(new Encryption(options.encryptions));
    }

    if (options.acknowledgments) {
      this.fields.push(new Acknowledgments(options.acknowledgments));
    }

    if (options.preferredLanguages) {
      this.fields.push(new PreferredLanguages(options.preferredLanguages));
    }

    if (options.canonical) {
      this.fields.push(new Canonical(options.canonical));
    }

    if (options.policy) {
      this.fields.push(new Policy(options.policy));
    }

    if (options.hiring) {
      this.fields.push(new Hiring(options.hiring));
    }

    if (options.outtro) {
      this.fields.push(new Outtro(options.outtro));
    }
  }

  public match(path: string): boolean {
    return path === this.path;
  }

  public isPathAlternative(path: string): boolean {
    if (!this.pathAlternative) return false;
    return path === this.pathAlternative;
  }

  public middleware(): Middleware {
    return async (req, res, next) => {
      // Process get requests only
      if (req.url && req.method && req.method.toLowerCase() === "get") {
        if (this.isPathAlternative(req.url)) {
          res.writeHead(301, {
            Location: this.path,
          });
          return res.end();
        }
        if (this.match(req.url)) {
          const body = await this.render();
          res.writeHead(200, {
            ...this.headers,
          });
          return res.end(body);
        }
      }

      // Client did not request a security.txt policy
      return next();
    };
  }

  public async render(): Promise<string> {
    if (this.cachedText) {
      return this.cachedText;
    }

    const text = new Array<string>();
    this.fields.forEach((field) => {
      text.push(field.render());
    });

    this.cachedText = this.privateKey
      ? await this.signText(text.join("\n"))
      : text.join("\n");

    return this.cachedText;
  }

  private async signText(text: string): Promise<string> {
    const openpgp = await import("openpgp");

    const message = await openpgp.createCleartextMessage({
      text,
    });

    const signedMessage = await openpgp.sign({
      message,
      signingKeys: this.privateKey,
    });

    return signedMessage.toString();
  }
}
