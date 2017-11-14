var path = require("path")

module.exports = {
	build: {
		env: require("./prod.env"),
		productionSourceMap: true,
		assetsRoot: path.resolve(__dirname, "../dist")
	}
}