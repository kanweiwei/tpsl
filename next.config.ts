import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export'
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...nextConfig,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/fibonacci",
        permanent: true,
      },
    ];
  },
};
