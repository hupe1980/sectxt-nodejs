import { Field, FieldName } from "./field";

export class Intro extends Field {
  constructor(private readonly comment: string) {
    super(FieldName.INTRO);
  }

  public render(): string {
    return `${this.renderComment(this.comment)}`;
  }
}
