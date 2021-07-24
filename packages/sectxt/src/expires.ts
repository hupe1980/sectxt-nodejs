import { Field, FieldName } from "./field";

export interface DateWithComment {
  readonly comment?: string;
  readonly value: Date;
}

export class Expires extends Field {
  constructor(private readonly date: Date | DateWithComment) {
    super(FieldName.EXPIRES);
  }

  public render(): string {
    if (this.date instanceof Date) {
      return `${this.name}: ${this.date.toISOString()}`;
    }
    const text = new Array<string>();
    if (this.date.comment) {
      text.push(this.renderComment(this.date.comment));
    }
    text.push(`${this.name}: ${this.date.value.toISOString()}`);
    return text.join("\n");
  }
}
