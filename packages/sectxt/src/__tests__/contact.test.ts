import { Contact } from "../contact";

describe("contact", () => {
  test("render web uri value", () => {
    const contact = new Contact(["https://example.org"]);
    expect(contact.render()).toEqual("Contact: https://example.org");
  });

  test("render tel value", () => {
    const contact = new Contact(["tel:123-456-789"]);
    expect(contact.render()).toEqual("Contact: tel:123-456-789");
  });

  test("render email value", () => {
    const contact = new Contact(["mailto:security@example.org"]);
    expect(contact.render()).toEqual("Contact: mailto:security@example.org");
  });

  test("render malformed value", () => {
    expect(() => {
      new Contact(["xyz"]);
    }).toThrowError(
      "Each contact field must begin with https:// for web URIs; tel: for telephone numbers; or mailto: for e-mails."
    );
  });

  test("render value with comment", () => {
    const contact = new Contact([
      { comment: "# Comment", value: "https://example.org" },
    ]);
    expect(contact.render()).toEqual("# Comment\nContact: https://example.org");
  });
});
