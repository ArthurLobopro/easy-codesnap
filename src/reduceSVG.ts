import { type Config, optimize } from "svgo";

export function reduceSVG(svgContent: string) {
    return optimize(svgContent, svgoConfig).data;
}

const svgoConfig: Config = {
    floatPrecision: 8,
    multipass: true,
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
                        keepDataAttrs: false,
                    },
                },
            },
        },
        {
            name: "removeAttrs",
            params: {
                attrs: ["textLength", "text-decoration"],
            },
        },
    ],
};
