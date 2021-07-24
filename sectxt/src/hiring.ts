import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Hiring extends Field {
  constructor(private readonly links: Value[] | ValueWithComment[]) {
    super(FieldName.HIRING);
  }

  public render(): string {
    return this.renderValues(this.links);
  }
}
