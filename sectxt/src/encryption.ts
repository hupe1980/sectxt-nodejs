import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Encryption extends Field {
  constructor(private readonly keys: Value[] | ValueWithComment[]) {
    super(FieldName.ENCRYPTION);
  }

  public render(): string {
    return this.renderValues(this.keys);
  }
}
