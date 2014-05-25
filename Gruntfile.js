/*jshint node:true, strict:false */
module.exports = function( grunt ) {

grunt.loadNpmTasks( 'grunt-contrib-jshint' );
grunt.loadNpmTasks( 'grunt-git-authors' );
grunt.loadNpmTasks( 'grunt-contrib-connect' );

grunt.initConfig({
	jshint: {
		options: {
			jshintrc: '.jshintrc'
		},
		main: [ '*.js' ],
		tests: [ 'test/**/*.js' ]
	},
	connect: {
		server: {
			options: {
				port: 8000,
				hostname: 'localhost',
				base: '.'
			}
		}
	}
});

grunt.registerTask('qunit', 'Run the test suite on PhantomJS', function () {
	var done = this.async(),
		phantomjs = require('grunt-lib-phantomjs').init(grunt),
		fs = require('fs'),
		output = '';

	function normalise(xmlStr) {
		return xmlStr
			// Remove timestamp and time attributes as those are variable
			.replace(/timestamp="([^"]+)"/g, '')
			.replace(/time="([^"]+)"/g, '');
	}

	phantomjs.on('console', function (data) {
		output = data;
		phantomjs.halt();
	});

	phantomjs.on('fail.load', function () {
		grunt.warn('PhantomJS unable to load URL.');
		phantomjs.halt();
	});

	phantomjs.on('fail.timeout', function () {
		grunt.warn('PhantomJS timed out.');
		phantomjs.halt();
	});

	phantomjs.spawn('http://localhost:8000/test/index.html', {
		options: {
			timeout: 5 * 1000
		},
		// Once phantomjs is halted
		done: function(err) {
			var expected = fs.readFileSync(__dirname + '/test/expected.xml'),
				actual = output;

			expected = normalise(String(expected).trim());
			actual = normalise(String(actual).trim());

			if ( expected === actual ) {
				grunt.log.ok('XML output matches expected pattern.');
				done();
			} else if (err) {
				grunt.warn(err);
				done(false);
			} else {
				grunt.warn('Output does not match expected pattern.');
				grunt.log.writeln('Expected:\n' + expected + '\nActual:\n' + actual);
				done(false);
			}
		}
	});
});

grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
grunt.registerTask('default', 'test');

};
