const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5728-182-0-100-78.ngrok-free.app",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "5728-182-0-100-78.ngrok-free.app",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        "./node_modules/apexcharts-clevision"
      ),
    };

    return config;
  },
};
