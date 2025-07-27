/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/webview/**/*.tsx", "./webview/index.html"],
    theme: {
        extend: {
            colors: {
                "toolbar-hover-background": "var(--vscode-toolbar-hoverBackground)"
            }
        },
    },
    corePlugins: {
        preflight: false
    },
    plugins: [],
};