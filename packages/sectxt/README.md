# sectxt
[![Build Status](https://github.com/hupe1980/sectxt-nodejs/workflows/ci/badge.svg)](https://github.com/hupe1980/sectxt-nodejs/workflows/ci/badge.svg)
> A Node.js Security.txt implementation

Features:
* Middleware
* Intro / Outtro
* Comments
* Custom ordering
* Signing

References:
* [security.txt RFC](https://tools.ietf.org/html/draft-foudil-securitytxt)
* [security.txt project on github](https://github.com/securitytxt/security-txt)

## Installation
```bash
yarn add sectxt
```

## Usage
```typescript
import { SecurityTxt } from "sectxt";

const securityTxt = new SecurityTxt({
    contacts: ["mailto:security@example.org"],
    expires: new Date("2022-12-31"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
});

console.log(await securityTxt.render());
```
outputs:
```txt
Contact: mailto:security@example.org
Expires: 2022-12-31T00:00:00.000Z
Preferred-Languages: en, de
Hiring: https://secjobs.example.org
```

### Intro / Outtro
```typescript
import { SecurityTxt } from "sectxt";

const securityTxt = new SecurityTxt({
  intro: "Intro",
  contacts: ["mailto:security@example.org"],
  expires: new Date("2019-01-16"),
  outtro: "Outtro",
});

console.log(await securityTxt.render());
```
outputs:
```
# Intro

Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z

# Outtro
```

### Adding comments
```typescript
import { SecurityTxt } from "sectxt";

const securityTxt = new SecurityTxt({
    contacts: [{
      comment:"This comment is displayed directly above the field", 
      value: "mailto:security@example.org",
    }],
    expires: new Date("2019-01-16"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
});

console.log(await securityTxt.render());
```
outputs:
```
# This comment is displayed directly above the field
Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z
Preferred-Languages: en, de
Hiring: https://secjobs.example.org
```

### Field ordering
```typescript
import { SecurityTxt, FieldName } from "sectxt";

const securityTxt = new SecurityTxt({
  intro: "Intro",
  contacts: ["mailto:security@example.org"],
  expires: new Date("2019-01-16"),
  outtro: "Outtro",
  order: [FieldName.EXPIRES, FieldName.CONTACT],
});

console.log(await securityTxt.render());
```
outputs:
```
# Intro

Expires: 2019-01-16T00:00:00.000Z
Contact: mailto:security@example.org

# Outtro
```

### Signed security.txt
```typescript
const privateKey = await openpgp.decryptKey({
  privateKey: await openpgp.readPrivateKey({
    armoredKey: privateKeyArmored,
  }),
  passphrase: "helloworld",
});

const securityTxt = new SecurityTxt({
  privateKey,
  contacts: ["mailto:security@example.org"],
  expires: new Date("2019-01-16"),
});

console.log(await securityTxt.render());
```
outputs:
```
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z
-----BEGIN PGP SIGNATURE-----

[signature]
-----END PGP SIGNATURE-----
```

### Middleware
```typescript
import express from "express";
import { sectxt } from "sectxt";

const app = express();

app.use(
  sectxt({
    contacts: ["mailto:security@example.org"],
    expires: new Date("2022-12-31"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
  })
);

app.get("/", (_req, res) => {
  res.send("Hello world!");
});

app.listen(3000, () => {
  console.log("The application is listening on port 3000!");
});
```

### Gatsby
See [gatsby-plugin-sectxt](https://github.com/hupe1980/sectxt-nodejs/tree/main/packages/gatsby-plugin-sectxt).

## Examples
See more complete [examples](https://github.com/hupe1980/sectxt-nodejs/tree/main/examples).

## License
[MIT](https://github.com/hupe1980/sectxt-nodejs/tree/main/sectxt/LICENSE)

