import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // This now points to our single, static route
        source: "/api/event",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Vercel handles this securely on deployment
          },
          {
            // Only POST is needed for this endpoint
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            // Only Content-Type is needed now
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
