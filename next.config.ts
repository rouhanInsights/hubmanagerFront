import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
     domains: ["bucket-dh7ovx.s3.ap-south-1.amazonaws.com"],
    remotePatterns: [
      
      {
        protocol: "https",
        hostname: "calcuttafreshfoods.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/bucket-dh7ovx/product-image/**",
      },
    ],
  },
};

export default nextConfig;
