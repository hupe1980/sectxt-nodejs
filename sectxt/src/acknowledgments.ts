import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Acknowledgments extends Field {
  constructor(private readonly links: Value[] | ValueWithComment[]) {
    super(FieldName.ACKNOWLEDGMENTS);
  }

  public render(): string {
    return this.renderValues(this.links);
  }
}
