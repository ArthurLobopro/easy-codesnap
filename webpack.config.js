//@ts-check

"use strict";

const path = require("path");

/** 
 * @param {{mode: "production" | "development"}} argv 
 * @returns {import('webpack').Configuration[]}
 * */
const config = (env, argv) => {
  const devtool = argv.mode === "production" ? false : "source-map";

  return [
    {
      target: "node",
      entry: "./src/extension/extension.ts",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "extension.js",
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
      },
      devtool,
      externals: {
        vscode: "commonjs vscode",
      },
      resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        mainFields: ["browser", "module", "main"],
        extensions: [".ts", ".js"],
        alias: {},
        fallback: {}
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "esbuild-loader"
              }
            ]
          }
        ]
      }
    },
    {
      target: "webworker",
      entry: "./src/webview/index.ts",
      output: {
        path: path.resolve(__dirname, "dist/webview"),
        filename: "webview.js",
        devtoolModuleFilenameTemplate: "../[resource-path]"
      },
      devtool,
      resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        mainFields: ["browser", "module", "main"],
        extensions: [".tsx", ".ts", ".js"],
        alias: {},
        fallback: {}
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "esbuild-loader",
                options: {
                  tsconfig: "./src/webview/tsconfig.json"
                }
              }
            ]
          },
          {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  exportType: "named",
                  namedExport: "ReactComponent",
                  expandProps: "end",
                  svgProps: {},
                  plugins: ["@svgr/plugin-jsx"],

                }
              },
            ],
          },
        ]
      }
    }
  ];
};

module.exports = config;