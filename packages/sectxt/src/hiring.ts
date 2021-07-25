import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Hiring extends Field {
  constructor(private readonly links: Value[] | ValueWithComment[]) {
    super(FieldName.HIRING);

    links.forEach((link) => {
      const value = typeof link === "string" ? link : link.value;
      if (!value.startsWith("https://")) {
        throw new Error("Each hiring field must begin with https://.");
      }
    });
  }

  public render(): string {
    return this.renderValues(this.links);
  }
}
