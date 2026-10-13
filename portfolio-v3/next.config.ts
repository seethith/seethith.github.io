import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  output: 'export',
  basePath: '/v3',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname) },
  poweredByHeader: false,
};
export default config;
