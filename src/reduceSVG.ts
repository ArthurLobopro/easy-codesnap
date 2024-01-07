import { PluginConfig, optimize } from "svgo"

const svgoConfig: { plugins: PluginConfig[] } = {
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {
                    removeViewBox: false,
                    removeUnknownsAndDefaults: {
                        defaultAttrs: true,
                        uselessOverrides: true,
                        unknownAttrs: true,
                        keepAriaAttrs: false,
                        keepDataAttrs: false
                    }
                }
            }
        }
    ]
}

export function reduceSVG(svgContent: string) {
    return optimize(svgContent, {
        floatPrecision: 8,
        plugins: svgoConfig.plugins
    }).data
}