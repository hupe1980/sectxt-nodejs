import { Field, CustomFieldName } from "./field";

export class Outtro extends Field {
  constructor(private readonly comment: string) {
    super(CustomFieldName.OUTTRO);
  }

  public render(): string {
    return `\n${this.renderComment(this.comment)}`;
  }
}
