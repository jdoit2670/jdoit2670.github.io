const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const lightningcss = require("lightningcss");
const browserslist = require("browserslist");
const { EsbuildPlugin } = require("esbuild-loader");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
	mode: "production",
	devtool: "source-map",
	entry: ["./src/index.js", "./src/styles.css"],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "public"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				// Match `.js`, `.jsx`, `.ts` or `.tsx` files
				test: /\.[jt]sx?$/,
				loader: "esbuild-loader",
				options: {
					// JavaScript version to compile to
					target: "es2015",
				},
			},
			// You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
			{
				test: /\.(jpe?g|png)$/i,
				type: "asset",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			favicon: "./src/favicon/favicon.ico",
		}),
		new MiniCssExtractPlugin({
			filename: "styles.css",
		}),
		new FaviconsWebpackPlugin({
			logo: "./src/favicon/android-chrome-512x512.png",
			manifest: "./src/favicon/site.webmanifest",
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin({
				minify: CssMinimizerPlugin.lightningCssMinify,
				minimizerOptions: {
					targets: lightningcss.browserslistToTargets(browserslist(">= 0.25%")),
				},
			}),
			new EsbuildPlugin({
				target: "es2015", // Syntax to transpile to (see options below for possible values)
			}),
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.sharpMinify,
					options: {
						encodeOptions: {
							// Your options for `sharp`
							// https://sharp.pixelplumbing.com/api-output
							png: {
								quality: 90,
							},
						},
					},
				},
			}),
		],
	},
};
