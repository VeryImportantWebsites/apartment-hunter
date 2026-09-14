import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // Static export: this app has no route handlers, server actions, proxy, or dynamic
  // server functions — `next build` already prerendered every route as `○ (Static)`,
  // so the server deployment was serving purely static content. Emitting `out/` drops
  // the Node runtime (and its cold starts) without changing the app.
  // Revert by deleting this line if a server feature is ever added.
  output: "export",
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
