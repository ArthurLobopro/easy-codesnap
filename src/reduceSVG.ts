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
                    },

                }
            }
        },
        {
            name: "removeAttrs",
            params: {
                attrs: [
                    "textLength",
                ],
            },
        }
    ]
}

export function reduceSVG(svgContent: string) {
    return optimize(svgContent, {
        floatPrecision: 8,
        plugins: svgoConfig.plugins,
        multipass: true
    }).data
}