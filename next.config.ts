import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "embla-carousel-react",
    ],
  },
  images: {
    qualities: [25, 50, 72, 75],
    // unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 year (improves repeat-visit performance)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.sterlingfinance.uk",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "login.mycompanyregistration.uk",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
