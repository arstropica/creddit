(function() {
	'use strict';
	module.exports = function(grunt) {
		grunt
				.initConfig({
					pkg : grunt.file.readJSON('package.json'),

					project : {
						public : [ '../public' ],
						dev : [ './' ],
						assets : [ '<%= project.dev %>/assets' ],
						build : [ '<%= project.assets %>/build' ],
						dist : [ '<%= project.assets %>/dist' ],
						scss : [ '<%= project.assets %>/sass/style.scss' ],
						bs : [ '<%= project.dev %>/bower_components/bootstrap-sass/assets' ],
						obs : [ '<%= project.dev %>/bower_components/bootstrap-sass-official/assets' ],
						angular : {
							angular : [ '<%= project.dev %>/bower_components/angular' ],
							uirouter : [ '<%= project.dev %>/bower_components/angular-ui-router/release' ],
							route : [ '<%= project.dev %>/bower_components/angular-route' ],
							bootstrap : [ '<%= project.dev %>/bower_components/angular-bootstrap' ],
							animate : [ '<%= project.dev %>/bower_components/angular-animate' ],
							resource : [ '<%= project.dev %>/bower_components/angular-resource' ],
							sanitize : [ '<%= project.dev %>/bower_components/angular-sanitize' ],
						},
						jq : [ '<%= project.dev %>/bower_components/jquery/dist' ],
					},
					// Copy web assets from bower_components to more convenient
					// directories.
					copy : {
						stage : {
							files : [
									// BS Vendor scripts.
									{
										cwd : '<%= project.obs %>/javascripts/',
										src : [ '*.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/bootstrap'
									},

									// BS Fonts.
									{
										cwd : '<%= project.obs %>/fonts/bootstrap/',
										src : [ '**' ],
										expand : true,
										dest : '<%= project.public %>/fonts'
									},

									// jQuery Scripts.
									{
										cwd : '<%= project.jq %>/',
										src : [ 'jquery.min.js',
												'jquery.min.map' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.public %>/js/'
									},

									// Angular Scripts.
									{
										cwd : '<%= project.angular.angular %>/',
										src : [ 'angular.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

									{
										cwd : '<%= project.angular.bootstrap %>/',
										src : [ 'ui-bootstrap-tpls.js',
												'ui-bootstrap.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/bootstrap'
									},

									{
										cwd : '<%= project.angular.route %>/',
										src : [ 'angular-route.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

									{
										cwd : '<%= project.angular.uirouter %>/',
										src : [ 'angular-ui-router.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

									{
										cwd : '<%= project.angular.animate %>/',
										src : [ 'angular-animate.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

									{
										cwd : '<%= project.angular.resource %>/',
										src : [ 'angular-resource.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

									{
										cwd : '<%= project.angular.sanitize %>/',
										src : [ 'angular-sanitize.js' ],
										expand : true,
										filter : 'isFile',
										dest : '<%= project.build %>/js/angular/'
									},

							]
						},
					},

					// Concatenate unminified scripts
					concat : {
						options : {
							separator : ';'
						},
						bootstrap : {
							src : [ '<%= project.build %>/js/bootstrap/*.js' ],
							dest : '<%= project.dist %>/js/bootstrap.bundle.js'
						},
						angular : {
							src : [
									'<%= project.build %>/js/angular/angular.js',
									'<%= project.build %>/js/angular/angular-animate.js',
									'<%= project.build %>/js/angular/angular-sanitize.js',
									'<%= project.build %>/js/angular/angular-resource.js',
									'<%= project.build %>/js/angular/angular-route.js',
									'<%= project.build %>/js/angular/angular-ui-router.js' ],
							dest : '<%= project.dist %>/js/angular.bundle.js'
						},
					},

					// Minify scripts
					uglify : {
						options : {
							mangle : false
						},
						js : {
							files : [ {
								expand : true,
								cwd : '<%= project.dist %>/js/',
								src : [ '{,*/}*.js' ],
								dest : '<%= project.public %>/js/',
								ext : '.min.js',
								extDot : 'last'
							} ]
						}
					},

					jshint : {
						// define the files to lint
						files : [ 'Gruntfile.js',
								'<%= project.dist %>/js/{,*/}*.js',
								'<%= project.dist %>/js/{,*/}*.js' ],
						options : {
							// more options here if you want to override JSHint
							// defaults
							globals : {
								jQuery : true,
								console : true,
								module : true
							}
						}
					},

					sass : {
						stage : {
							options : {
								style : 'expanded',
								compass : true
							},
							files : {
								'<%= project.public %>/css/style.css' : '<%= project.scss %>'
							}
						}
					},

					// Clean Folders
					clean : [ "<%= project.dist %>", "<%= project.build %>" ],

					watch : {
						grunt : {
							files : [ 'Gruntfile.js' ]
						},
						sass : {
							files : '<%= project.assets %>/sass/{,*/}*.{scss,sass}',
							tasks : [ 'sass:stage' ]
						},
						merge : {
							files : '<%= project.build %>/**',
							tasks : [ 'concat:raw', 'concat:dist' ]

						},
						minify : {
							files : '<%= project.dist %>/js/{,*/}*.js',
							tasks : [ 'uglify:js' ]
						},
						jshint : {
							files : '<%= jshint.files %>',
							tasks : [ 'jshint' ]
						}
					}
				});
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-sass');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-contrib-clean');

		grunt.registerTask('update', [ 'delete', 'jshint', 'sass', 'copy' ]);
		grunt.registerTask('build', [ 'delete', 'jshint', 'sass', 'copy',
				'concat', 'uglify' ]);
		grunt.registerTask('delete', [ 'clean' ]);
		grunt.registerTask('default', [ 'update', 'watch' ]);
	};
}());
