import { IncomingMessage, ServerResponse } from "http";
import { Acknowledgments } from "./acknowledgments";
import { Canonical } from "./canonical";
import { Contact } from "./contact";
import { Encryption } from "./encryption";
import { Expires } from "./expires";
import { Field } from "./field";
import { Hiring } from "./hiring";
import { Policy } from "./policy";
import { PreferredLanguages } from "./preferred-languages";

export type NextFunction = () => void;

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void;

export interface SecurityTxtOptions {
  /**
   * @default /.well-known/security.txt
   */
  readonly path?: string;
  readonly pathAlternative?: string;

  /**
   * This field indicates an address that researchers should use for
   * reporting security vulnerabilities such as an email address, a phone
   * number and/or a web page with contact information.  The "Contact"
   * field MUST always be present in a "security.txt" file.
   */
  readonly contacts: string[];

  /**
   * This field indicates the date and time after which the data contained
   * in the "security.txt" file is considered stale and should not be used.
   */
  readonly expires: Date;

  /**
   * This field indicates an encryption key that security researchers
   * should use for encrypted communication.  Keys MUST NOT appear in this
   * field - instead the value of this field MUST be a URI pointing to a
   * location where the key can be retrieved.
   */
  readonly encryptions?: string[];

  /**
   * This field indicates a link to a page where security researchers are
   * recognized for their reports.  The page being referenced should list
   * security researchers that reported security vulnerabilities and
   * collaborated to remediate them.
   */
  readonly acknowledgments?: string[];

  /**
   * This field can be used to indicate a set of natural languages that
   * are preferred when submitting security reports.
   */
  readonly preferredLanguages?: string[];

  /**
   * This field indicates the canonical URIs where the "security.txt" file
   * is located, which is usually something like
   * "https://example.com/.well-known/security.txt".
   */
  readonly canonical?: string[];

  /**
   * This field indicates a link to where the vulnerability disclosure
   * policy is located. This can help security researchers understand the
   * organization's vulnerability reporting practices.
   */
  readonly policy?: string[];

  /**
   * The "Hiring" field is used for linking to the vendor's security-
   * related job positions.
   */
  readonly hiring?: string[];
}

export class SecurityTxt {
  public readonly path: string;
  public readonly headers: Record<string, string>;

  private readonly pathAlternative?: string;
  private readonly fields = new Array<Field>();

  constructor(options: SecurityTxtOptions) {
    this.path = options.path ?? "/.well-known/security.txt";
    this.headers = {
      "content-type": "text/plain; charset=utf-8",
    };

    this.pathAlternative = options.pathAlternative;

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
  }

  public match(path: string): boolean {
    return path === this.path;
  }

  public isPathAlternative(path: string): boolean {
    if (!this.pathAlternative) return false;
    return path === this.pathAlternative;
  }

  public middleware(): Middleware {
    const body = this.render();

    return (req, res, next) => {
      // Process get requests only
      if (req.url && req.method && req.method.toLowerCase() === "get") {
        if (this.isPathAlternative(req.url)) {
          res.writeHead(301, {
            Location: this.path,
          });
          res.end();
          return;
        }
        if (this.match(req.url)) {
          res.writeHead(200, {
            ...this.headers,
          });
          res.end(body);
          return;
        }
      }

      // Client did not request a security.txt policy
      return next();
    };
  }

  public render(): string {
    const text = new Array<string>();
    this.fields.forEach((field) => {
      text.push(field.render());
    });

    return text.join("\n");
  }
}
