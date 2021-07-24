# sectxt
[![Build Status](https://github.com/hupe1980/sectxt-nodejs/workflows/ci/badge.svg)](https://github.com/hupe1980/sectxt-nodejs/workflows/ci/badge.svg)
> A Node.js Security.txt implementation

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
    expires: new Date("9999-12-31"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
});

console.log(securityTxt.render());
```
outputs:
```txt
Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z
Preferred-Languages: en, de
Hiring: https://secjobs.example.org
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

console.log(securityTxt.render());
```
outputs:
```
# This comment is displayed directly above the field
Contact: mailto:security@example.org
Expires: 2019-01-16T00:00:00.000Z
Preferred-Languages: en, de
Hiring: https://secjobs.example.org
```

### Middleware
```typescript
import express from "express";
import { sectxt } from "sectxt";

const app = express();

app.use(
  sectxt({
    contacts: ["mailto:security@example.org"],
    expires: new Date("9999-12-31"),
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

## Examples
See more complete [examples](https://github.com/hupe1980/sectxt-nodejs/tree/main/examples).

## License
[MIT](https://github.com/hupe1980/sectxt-nodejs/tree/main/sectxt/LICENSE)

