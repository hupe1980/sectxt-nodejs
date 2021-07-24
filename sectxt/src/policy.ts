import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Policy extends Field {
  constructor(private readonly links: Value[] | ValueWithComment[]) {
    super(FieldName.POLICY);
  }

  public render(): string {
    return this.renderValues(this.links);
  }
}
