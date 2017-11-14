// Karma configuration
// Generated on Mon Oct 02 2017 15:14:04 GMT+0200 (Vest-Europa (sommertid))
var webpackConfig = require( "./bin/webpack.test.conf" );


module.exports = function ( config ) {
	config.set( {
		basePath: '',
		frameworks: ['mocha', 'sinon-chai'],
		files: [
			'test/index.ts'
		],
		exclude: [],
		preprocessors: {
			'./test/index.ts': [ 'webpack', 'sourcemap' ]
		},
		webpackMiddleware: {
			noInfo: true,
		},
		webpack: webpackConfig,
		reporters: [ 'progress', 'spec', 'coverage' ],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: [ 'ChromeHeadless' ],
		singleRun: false,
		concurrency: Infinity,
		coverageReporter: {
			dir: './test/coverage',
			reporters: [
				{ type: 'lcov', subdir: '.' },
				{ type: 'text-summary' },
			]
		},
		mime: {
			'text/x-typescript': ['ts','tsx']
		}
	} )
}
