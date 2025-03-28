import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import UnoCSS from "unocss/vite"
// https://vite.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()],
		},
	},
	plugins: [vue(), UnoCSS()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
})
