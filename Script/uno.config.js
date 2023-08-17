import { defineConfig, presetUno } from "unocss";

export default defineConfig({
	content: {
		filesystem: ["src/**/*.{html,js,jsx}"],
	},
	presets: [presetUno()],
});
