import { Field, FieldName } from "./field";

export class Outtro extends Field {
  constructor(private readonly comment: string) {
    super(FieldName.OUTTRO);
  }

  public render(): string {
    return `${this.renderComment(this.comment)}`;
  }
}
