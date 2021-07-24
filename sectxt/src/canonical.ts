import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Canonical extends Field {
  constructor(private readonly uris: Value[] | ValueWithComment[]) {
    super(FieldName.CANONICAL);
  }

  public render(): string {
    return this.renderValues(this.uris);
  }
}
