/*
  -- TOP LEVEL FUNCTIONS --
  gulp.task - Define tasks
  gulp.src - Point to files to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

import gulp from "gulp";
import postcss from "gulp-postcss";
import clean from "gulp-clean";
import jeditor from "gulp-json-editor";
import fs from "fs";
let json = JSON.parse(fs.readFileSync("./package.json"));
import filter from "gulp-filter";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
const target = process.env.TARGET || "chromium";
const paths = {
	css: "./**/*.css",
	build: "./build",
	js: "./**/*.js",
	html: "./**/*.html",
	assets: "./assets/**",
	manifest: `manifest.${target}.json`,
};

function checkTarget() {
	if (target === "chromium") {
		return ["./**/*.chromium.*", "./contentscript.js"];
	} else if (target === "firefox") {
		return ["./**/*.firefox.*", "./contentscript.js"];
	} else throw Error;
}

function cleanBuild() {
	return gulp.src(paths.build, { read: false, allowEmpty: true }).pipe(clean());
}

function css() {
	return gulp
		.src(paths.css)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(postcss())
		.pipe(gulp.dest(paths.build));
}

function js() {
	return gulp
		.src(paths.js)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(uglify())
		.pipe(gulp.dest(paths.build));
}

function copyAssets() {
	return gulp.src(paths.assets).pipe(gulp.dest(paths.build));
}

function copyHTML() {
	return gulp
		.src(paths.html)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(gulp.dest(paths.build));
}

function manifest() {
	return gulp
		.src(paths.manifest)
		.pipe(
			rename(function (path) {
				path.basename = "manifest";
			}),
		)
		.pipe(
			jeditor({
				version: json.version,
				description: json.description,
			}),
		)
		.pipe(
			jeditor(function (json) {
				delete json.$schema;
				return json;
			}),
		)
		.pipe(gulp.dest(paths.build));
}
/* Dev Functions */

function devcss(fileName) {
	return gulp
		.src(fileName)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(postcss())
		.pipe(gulp.dest(paths.build));
}

function devjs(fileName) {
	return gulp
		.src(fileName)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(uglify())
		.pipe(gulp.dest("./build"));
}

function devcopyHTML(fileName) {
	return gulp
		.src(fileName)
		.pipe(filter(checkTarget()))
		.pipe(
			rename(function (path) {
				if (path.basename.includes(target)) {
					return {
						dirname: path.dirname,
						basename: path.basename.replace(`.${target}`, ""),
						extname: path.extname,
					};
				}
			}),
		)
		.pipe(gulp.dest(paths.build));
}

function watch() {
	copyAssets(), css(), js(), copyHTML();
	gulp.watch(paths.js).on("change", devjs);
	gulp.watch(paths.css).on("change", devcss);
	gulp.watch(paths.html).on("change", devcopyHTML);
	gulp.watch(paths.manifest, { ignoreInitial: false }, gulp.series(manifest));
}

export { cleanBuild, watch, css };
