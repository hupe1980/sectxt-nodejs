# gatsby-plugin-sectxt
> Gatsby plugin to create security.txt with [sectxt](https://github.com/hupe1980/sectxt-nodejs/tree/main/sectxt)

## Installation
```bash
yarn add gatsby-plugin-sectxt
```

## Usage
```
// gatsby-config.js

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: `gatsby-plugin-sectxt`,
      options: {
        pathAlternative: "/security.txt",
        contacts: ["mailto:security@example.org"],
        expires: new Date("2022-12-31"),
        preferredLanguages: ["en", "de"],
        hiring: ["https://secjobs.example.org"],
      },
    },
  ],
}
```

## Examples
See more complete [examples](https://github.com/hupe1980/sectxt-nodejs/tree/main/examples).

## License
[MIT](https://github.com/hupe1980/sectxt-nodejs/tree/main/gatsby-plugin-sectxt/LICENSE)