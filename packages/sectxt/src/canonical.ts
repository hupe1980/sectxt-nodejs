import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Canonical extends Field {
  constructor(private readonly uris: Value[] | ValueWithComment[]) {
    super(FieldName.CANONICAL);

    uris.forEach((uri) => {
      const value = typeof uri === "string" ? uri : uri.value;
      if (!value.startsWith("https://")) {
        throw new Error("Each cononical field must begin with https://.");
      }
    });
  }

  public render(): string {
    return this.renderValues(this.uris);
  }
}
