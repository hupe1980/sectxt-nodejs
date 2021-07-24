/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

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
