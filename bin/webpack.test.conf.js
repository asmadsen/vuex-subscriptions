var webpack = require("webpack")
var merge = require("webpack-merge")
var baseConfig = require("./webpack.base.conf")

var webpackConfig = merge(baseConfig, {
	devtool: "inline-source-map",
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: '"testing"'
			}
		}),
		new webpack.SourceMapDevToolPlugin({
			filename: null, // if no value is provided the sourcemap is inlined
			test: /\.(ts|js)($|\?)/i // process .js and .ts files only
		})
	]
});

delete webpackConfig.entry
delete webpackConfig.output

module.exports = webpackConfig