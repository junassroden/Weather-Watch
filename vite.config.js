import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/js/App.jsx",
            ],
            refresh: true,
        }),

        react(),
    ],

    preview: {
        host: "0.0.0.0",
        allowedHosts: [
            "weather-watch-rfda.onrender.com",
        ],
    },
});