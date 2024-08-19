//@ts-check

"use strict"

const path = require("path")
const webpack = require("webpack")


/** 
 * @param {{mode: "production" | "development"}} argv 
 * @returns {import('webpack').Configuration[]}
 * */
const config = (env, argv) => {
  const devtool = argv.mode === "production" ? false : "source-map"

  return [
    {
      target: "node",
      entry: "./src/extension.ts",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "extension.js",
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
      },
      devtool,
      externals: {
        vscode: "commonjs vscode"
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
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "ts-loader"
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
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
      },
      devtool,
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
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "ts-loader",
                options: {
                  configFile: path.resolve(__dirname, "./src/webview/tsconfig.json")
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
module.exports = config