import { Field, FieldName, Value, ValueWithComment } from "./field";

export class Contact extends Field {
  constructor(private readonly addresses: Value[] | ValueWithComment[]) {
    super(FieldName.CONTACT);

    addresses.forEach((address) => {
      const value = typeof address === "string" ? address : address.value;
      if (!value.match("(https://|tel:|mailto:).*")) {
        throw new Error(
          "Each contact field must begin with https:// for web URIs; tel: for telephone numbers; or mailto: for e-mails."
        );
      }
    });
  }

  public render(): string {
    return this.renderValues(this.addresses);
  }
}
