/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/webview/**/*.tsx", "./webview/index.html"],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false
    },
    plugins: [],
};