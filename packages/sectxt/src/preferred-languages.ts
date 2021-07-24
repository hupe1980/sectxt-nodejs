import { Field, FieldName } from "./field";

export type Tags = string[];

export interface TagsWithComment {
  readonly comment?: string;
  readonly value: Tags;
}

export class PreferredLanguages extends Field {
  constructor(private readonly tags: Tags | TagsWithComment) {
    super(FieldName.PREFERRED_LANGUAGES);
  }

  public render(): string {
    if (Array.isArray(this.tags)) {
      return `${this.name}: ${this.tags.join(", ")}`;
    }
    const text = new Array<string>();
    if (this.tags.comment) {
      text.push(this.renderComment(this.tags.comment));
    }
    text.push(`${this.name}: ${this.tags.value.join(", ")}`);
    return text.join("\n");
  }
}
