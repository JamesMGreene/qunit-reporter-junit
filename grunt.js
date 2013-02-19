/*jshint node:true, strict:false */
module.exports = function( grunt ) {

grunt.initConfig({
	// TODO: qunit: {},
	lint: {
		main: 'qunit-*.js',
		grunt: 'grunt.js'
	},
	// TODO: Remove when migrating to grunt 0.4
	jshint: (function() {
		var rc = grunt.file.readJSON( ".jshintrc" ),
			settings = {
				options: rc,
				globals: {}
			};

		(rc.predef || []).forEach(function( prop ) {
			settings.globals[ prop ] = true;
		});
		delete rc.predef;

		return settings;
	})()
});

grunt.registerTask('default', 'lint');

};
