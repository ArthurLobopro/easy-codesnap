/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/webview/**/*.tsx", "./webview/index.html"],
    theme: {
        extend: {
            colors: {
                "toolbar-hover-background": "var(--vscode-toolbar-hoverBackground)",
                "sidebar-background": "var(--vscode-sideBar-background)"
            }
        },
    },
    corePlugins: {
        preflight: false
    },
    plugins: [],
};