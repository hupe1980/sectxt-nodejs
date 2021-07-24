module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/.well-known/security.txt",
        destination: "/api/sectxt",
      },
    ];
  },
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
