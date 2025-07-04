import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d14d9vp3wdof84.cloudfront.net",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        port: "",
        pathname: "/img/b/**",
      },
      {
        protocol: "https",
        hostname: "images.tcdn.com.br",
        port: "",
        pathname: "/img/img_prod/**",
      },
      {
        hostname: "cdn.awsli.com.br",
      },
      {
        hostname: "panini.com.br",
      },
    ],
  },
};

export default nextConfig;
