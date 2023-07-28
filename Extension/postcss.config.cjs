/** @type {import("postcss-load-config").Config} */

const config = {
	plugins: [
		require("postcss-nested"),
		require("cssnano")({
			preset: "default",
		}),
	],
};

module.exports = config;
