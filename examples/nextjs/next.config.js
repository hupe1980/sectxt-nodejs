module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/.well-known/security.txt',
        destination: '/api/sectxt',
      },
    ]
  },
}
