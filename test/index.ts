const testsContext = require.context("./specs", true, /\.tsx?$/)
testsContext.keys().forEach(testsContext);