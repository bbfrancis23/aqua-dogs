/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// added for code editor
module.exports = nextConfig;
const removeImports = require('next-remove-imports')();
module.exports = removeImports({
  experimental: { esmExternals: true },
});

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
