const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/shared", "@repo/find-react"],
  webpack: (config, context) => {
    const { dev } = context;

    const excalidrawAssetsPath = dev
      ? "excalidraw-assets-dev"
      : "excalidraw-assets";

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: `node_modules/@excalidraw/excalidraw/dist/${excalidrawAssetsPath}`,
            to: `../public/${excalidrawAssetsPath}`,
          },
        ],
      })
    );

    return config;
  },
};
