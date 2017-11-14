var path = require("path")

function resolve(dir) {
	return path.join(__dirname + ".." + dir)
}

module.exports = {
	entry: {
		index: "./src/index.ts"
	},
	output: {
		path: resolve("dist"),
		filename: "[name].js"
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: [resolve("src"), resolve("test")]
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				exclude: /node_modules/
			}
		]
	}
}