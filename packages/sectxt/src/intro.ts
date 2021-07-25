import { Field, CustomFieldName } from "./field";

export class Intro extends Field {
  constructor(private readonly comment: string) {
    super(CustomFieldName.INTRO);
  }

  public render(): string {
    return `${this.renderComment(this.comment)}\n`;
  }
}
