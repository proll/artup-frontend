module.exports = function(grunt) {
	var fs = require('fs');

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadTasks(__dirname + "/tasks");


	grunt.initConfig({

		squeeze: {
			app: {
				src:['app/*.html'],
				base: "app",
				images: "images",
				dest: "deploy"
			}
		},

		handlebars:{
			compile:{
				options:{
					wrapped:true,
					namespace:"aup.Templates.FORM.TEMPLATES",
					processName:function (filename) {
						var name = filename.split('/');
						name = name[name.length - 1];
						name = name.substr(0, name.length - 5);
						return name;
					}
				},
				files:{
					"app/js_compile/compilate_tpl_forms.js":["app/templates/tpl_forms/*.html"]
				}
			}
		},

		/* Compiling less files */
		less: {
			all: {
				src: 'app/styles/less/aup.less',
				dest: 'app/styles/css/aup.css',
				options: {
					compress: true
				}
			}
		},

		server: {
			base: "./app",
			port: 3007,
			keepalive: true
		},

		sprites: {
			sourcePath: "app/images/sprites/",
			webPath: 	"/images/sprites/",
			lessPath: 	"app/styles/less/sprite.less",
		},
		watch:{},

		staging: 'temp',
		// final build output
		output: 'dist'		
	});
	
	// grunt.registerTask('default', ['concat', 'min', 'less']);
	// grunt.registerTask('build', ['less']);
	// grunt.registerTask('production', 'handlebars concat:production  min:production');
};