const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const lightningcss = require("lightningcss");
const browserslist = require("browserslist");
const { EsbuildPlugin } = require("esbuild-loader");

module.exports = {
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
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "styles.css",
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
		],
	},
};
