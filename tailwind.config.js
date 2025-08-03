/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/webview/**/*.tsx", "./webview/index.html"],
    theme: {
        extend: {
            colors: {
                "toolbar-hover-background": "var(--vscode-toolbar-hoverBackground)",
                "sidebar-background": "var(--vscode-sideBar-background)",
                "vscode-foreground": "var(--vscode-foreground)",
                "vscode-background": "var(--vscode-background)",
                "vscode-disabled-foreground": "var(--vscode-disabledForeground)",
                "vscode-focus-border": "var(--vscode-focusBorder)",
                "vscode-sidebar-dropbackground": "var(--vscode-sideBar-dropBackground)"
            }
        },
    },
    corePlugins: {
        preflight: false
    },
    plugins: [],
};