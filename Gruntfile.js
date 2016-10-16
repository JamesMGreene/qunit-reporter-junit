/*jshint node:true, strict:false */

// Node.js core modules
var os = require('os');
var fs = require('fs');
var path = require('path');


module.exports = function( grunt ) {
	var localPort = 8000;

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
					port: localPort
				}
			}
		},
		qunitExpected: {
			options: {
				echo: false
			},
			oldApiFile: {
				src: [ 'test/index-old-api.html' ]
			},
			oldApiHttp: {
				options: {
					urls: [ 'http://localhost:' + localPort + '/<%= qunitExpected.oldApiFile.src[0] %>' ]
				}
			},
			newApiFile: {
				src: [ 'test/index.html' ]
			},
			newApiHttp: {
				options: {
					urls: [ 'http://localhost:' + localPort + '/<%= qunitExpected.newApiFile.src[0] %>' ]
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-git-authors' );


	var _consoleLog = console.log;
	var writeStreams = {};
	grunt.registerMultiTask(
		'consoleToFile',
		'Redirect console logging to file',
		function() {
			// Merge task-specific and/or target-specific options with these defaults.
			var options = this.options({
						echo: true
					});

			var taskTarget = this.target;
			var destFile = path.resolve( __dirname, this.files[0].dest );
			var writeStream = fs.createWriteStream( destFile );
			writeStreams[ taskTarget ] = writeStream;

			console.log = function() {
				if ( writeStreams[ taskTarget ] ) {  // CRITICAL CHECK
					writeStream.write( [].slice.call( arguments ).join( ' ' ) + '\n' );
				}

				if ( options.echo === true ) {
					return _consoleLog.apply( this, arguments );
				}
			};
		}
	);

	grunt.registerMultiTask(
		'restoreConsole',
		'Restore the console logging to its original state',
		function() {
			var taskTarget = this.target;
			var writeStream = writeStreams[ taskTarget ];

			if ( writeStream ) {
				writeStream.end();
				writeStream.close();
				writeStream = null;
				delete writeStreams[ taskTarget ];  // CRITICAL ACTION
			}

			console.log = _consoleLog;
		}
	);

	var fileMatchRegex = new RegExp(
				'^' +
				'<\\?xml version="1\\.0" encoding="UTF-8"\\?>\\n' +
				'<testsuites name="(http://localhost:8000|file:///.+?)/test/index(-old-api)?\\.html" tests="10" failures="5" errors="0" time="\\d+(\\.\\d+)?">\\n' +
				'<testsuite id="0" name="Module 1" hostname="localhost" tests="5" failures="2" errors="0" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<testcase name="test 1" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<failure type="AssertionFailedError" message="Assert fail 1 = 2">\\n' +
				'<actual value="1" />\\n' +
				'<expected value="2" />\\n' +
				'</failure>\\n' +
				'</testcase>\\n' +
				'<testcase name="test 2" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<failure type="AssertionFailedError" message="Assert fail 1 = 2">\\n' +
				'<actual value="1" />\\n' +
				'<expected value="2" />\\n' +
				'</failure>\\n' +
				'</testcase>\\n' +
				'<system-out>\\n' +
				'<!\\[CDATA\\[\\n' +
				'\\[Module 1, test 1, 2\\] Assert fail 1 = 2(\\nSource: [^\\[\\]]+)?\\n' +
				'\\[Module 1, test 2, 2\\] Assert fail 1 = 2(\\nSource: [^\\[\\]]+)?\\n' +
				'\\]\\]>\\n' +
				'</system-out>\\n' +
				'</testsuite>\\n' +
				'<testsuite id="1" name="Module 2" hostname="localhost" tests="5" failures="3" errors="0" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<testcase name="test 3" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<failure type="AssertionFailedError" message="Assert fail 1 = 2">\\n' +
				'<actual value="1" />\\n' +
				'<expected value="2" />\\n' +
				'</failure>\\n' +
				'</testcase>\\n' +
				'<testcase name="test 4" time="\\d+(\\.\\d+)?" timestamp="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z">\\n' +
				'<failure type="AssertionFailedError" message="Assert fail 1 = 2">\\n' +
				'<actual value="1" />\\n' +
				'<expected value="2" />\\n' +
				'</failure>\\n' +
				'<failure type="AssertionFailedError" message="Assert fail 1 = 3">\\n' +
				'<actual value="1" />\\n' +
				'<expected value="3" />\\n' +
				'</failure>\\n' +
				'</testcase>\\n' +
				'<system-out>\\n' +
				'<!\\[CDATA\\[\\n' +
				'\\[Module 2, test 3, 2\\] Assert fail 1 = 2\\n(Source: [^\\[\\]]+)?\\n' +
				'\\[Module 2, test 4, 2\\] Assert fail 1 = 2\\n(Source: [^\\[\\]]+)?\\n' +
				'\\[Module 2, test 4, 3\\] Assert fail 1 = 3\\n(Source: [^\\[\\]]+)?\\n' +
				'\\]\\]>\\n' +
				'</system-out>\\n' +
				'</testsuite>\\n' +
				'</testsuites>\\n' +
				'$'
			);

	grunt.registerMultiTask(
		'outputMatch',
		'Check file contents against an expected format RegExp',
		function() {
			var status = true;

			this.files.forEach(function( file ) {
				file.src.forEach(function( f ) {
					var content = ( grunt.file.read( f ) || '' );
					if ( fileMatchRegex.test( content ) ) {
						grunt.log.ok( 'XML actual output data matches expected format' );
					}
					else {
						grunt.fail.warn( 'XML actual output data does not match expected format' );
						status = false;
					}
				});
			});

			return status;
		}
	);

	grunt.registerMultiTask(
		'qunitExpected',
		'Execute QUnit tests in PhantomJS and compare the console output to an expected data file',
		function() {
			var taskTarget = this.target;

			// Merge task-specific and/or target-specific options with these defaults.
			var options = this.options({
						console: true,
						force: true,
						echo: false
					});

			if ( this.files.length > 1 ) {
				grunt.fail.warn( 'This task does not know how to handle multiple sets of input files' );
			}

			var filesSrc = ( this.files[0] || {} ).src || [];

			var actualResultFile = path.join( os.tmpdir(), taskTarget + '_actual.xml' );

			grunt.config.set(
				'consoleToFile.' + taskTarget,
				{
					options: {
						echo: options.echo
					},
					dest: actualResultFile
				}
			);
			grunt.task.run( 'consoleToFile:' + taskTarget );

			grunt.config.set(
				'qunit.' + taskTarget,
				{
					options: options,
					src: filesSrc
				}
			);
			grunt.task.run( 'qunit:' + taskTarget );

			grunt.config.set(
				'restoreConsole.' + taskTarget,
				{
					options: {},
					dest: actualResultFile
				}
			);
			grunt.task.run( 'restoreConsole:' + taskTarget );

			grunt.config.set(
				'outputMatch.' + taskTarget,
				{
					src: [ actualResultFile ]
				}
			);
			grunt.task.run( 'outputMatch:' + taskTarget );
		}
	);

	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunitExpected' ] );
	grunt.registerTask( 'default', [ 'test' ] );

};
