export type Value = string;

export interface ValueWithComment {
  readonly comment?: string;
  readonly value: Value;
}

export abstract class Field {
  constructor(public readonly name: FieldName) {}

  public abstract render(): string;

  protected renderComment(comment: string): string {
    if (comment.startsWith("#")) {
      return comment;
    }
    return `# ${comment}`;
  }

  protected renderValues(values: Value[] | ValueWithComment[]): string {
    const text = new Array<string>();

    values.forEach((value) => {
      if (typeof value === "string") {
        text.push(`${this.name}: ${value}`);
        return;
      }
      if (value.comment) {
        text.push(this.renderComment(value.comment));
      }
      text.push(`${this.name}: ${value.value}`);
    });
    return text.join("\n");
  }
}

export enum FieldName {
  CONTACT = "Contact",
  EXPIRES = "Expires",
  ENCRYPTION = "Encryption",
  ACKNOWLEDGMENTS = "Acknowledgments",
  PREFERRED_LANGUAGES = "Preferred-Languages",
  CANONICAL = "Canonical",
  POLICY = "Policy",
  HIRING = "Hiring",
}
