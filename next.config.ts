import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig & { output?: string } = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

if (process.env.STATIC_EXPORT === 'true') {
  nextConfig.output = 'export';
}

export default withNextIntl(nextConfig);
