module.exports = function(grunt) {
	var fs = 			require('fs-extra');
	var path = 			require('path');
	var crypto = 		require('crypto');
	var htmlpacker = 	require('html-minifier').minify;
	var jsparser = 		require("uglify-js").parser;
	var uglify = 		require("uglify-js").uglify;
	var csspacker = 	require('uglifycss') ;

	var linefeed = grunt.utils.linefeed;
	var appdir = "";
	var deploydir = "";
 
	/**
	 * Register the 'squeeze' task
	 *
	 * This task accepts files and steps through them to find a comment pattern
	 * that wraps a set of 'script' or 'link' elements. It replaces those
	 * elements within an indivudal comment block with a single element
	 * referencing a file into which they are all concatenated.
	 */
	grunt.registerMultiTask('squeeze', 'Replaces and concatenates js/css in special HTML comment blocks and compress js/css/html', function() {


		var name = this.target;
		var conf = this.data;
		var files = grunt.file.expand(conf.src);

		appdir = conf.base;
		deploydir = conf.dest;
		imagesdir = conf.images;

		// remove all previous deploy folder
		fs.removeSync(deploydir);

		


		files.map(grunt.file.read).forEach(function(content, i) {
			var p = files[i];
			if(p.indexOf(appdir) == 0) {
				p = p.substring(appdir.length);
			}else {
				return;
			}
 
			grunt.log.subhead('squeeze - ' + p);
			content = content.toString();
 
			// Replace and concatenate blocks of CSS/JS in HTML files
			if (!!squeeze_compressblocks) {
				try {
					content = squeeze_compressblocks(content);
				} catch (err) {
					grunt.warn(err)
				}
			}
			// Minify the HTML files that were processed
			if (!!minify_html) {
				try {
					content = minify_html(content);
				} catch (err) {
					grunt.warn(err)
				}
			}
 
			// Write the new HTML content to disk in the deploy directory
			grunt.file.write(deploydir + p, content);
			grunt.log.writeln('File "' + (deploydir + p).cyan + '" squeezed.');
		});

		imagesdir = "index.html";

		// copyimages
		fs.copy(appdir+"/"+imagesdir, deploydir+"/"+imagesdir, function (err) {
			if(err) console.error(err);
			console.log("images sux")//throw err;
		});
 
	});
 
 
	/**
	 * Process files with the blocks and compress the files within them.
	 */
	var squeeze_compressblocks = function(content) {
		var blocks = getBlocks(content);
 
		// Handle blocks
		blocks.forEach(function(el) {
			var block = el.raw.join(linefeed);
			var src = el.src;
			var type = el.type;
			var dest = el.dest;

			if(type == "templates") return;

			var combined = concat(src, { separator: '' });
			var minified = minify(type, combined, {});
			var filehash = md5_content(minified).slice(0,8);
			var filepath = dest.replace(new RegExp('(.' + type + ')'), '.' + filehash + '$1');


			// Write the concatenated, minified, and versioned file to the deploy directory
			grunt.file.write(deploydir + filepath, minified);
 
			// Fail task if errors were logged.
			if (this.errorCount) { return false; }
 
			// Otherwise, print a success message.
			grunt.log.writeln('File ' + (deploydir + filepath).cyan + ' squeezed.');
 
			// Update the content to reference the concatenated and versioned files
			content = usemin(type, content, block, filepath);
		});
 
		return content;
	};

	var concat = function(src, opts) {
		var files = grunt.file.expandFiles(src),
			sep = (!!opts && !!opts.separator) ? opts.separator : linefeed; 

		var contents = new Array();
		src.forEach(function(f) {
			contents.push(grunt.file.read(appdir+f));
		});
		return contents.join(sep);
	};
	

	/**
	 * minify:* is used to minify static content
	 */
	var minify = function(type, content, options) {
		if 		(type == "js") 		return minify_js(content, options);
		else if (type == "css") 	return minify_css(content, options);
		else if (type == "html") 	return minify_html(content, options);
	};
 
	var minify_js = function(content, options) {
		var ast = jsparser.parse(content); 	// parse code and get the initial AST
		ast = uglify.ast_mangle(ast); 		// get a new AST with mangled names
		ast = uglify.ast_squeeze(ast); 		// get an AST with compression optimizations

		var final_code = uglify.gen_code(ast); // compressed code here
		return final_code;
	};
 
	var minify_css = function(content, options) {
		return csspacker.processString(content);
	};
 
	var minify_html = function(content, options) {
		return htmlpacker(content, { 
            removeComments: true, 
            collapseWhitespace: true, 
            removeEmptyAttributes: true 
        }) ;
	};

	/**
	 * The 'md5' helper is a basic wrapper around crypto.createHash, with given
	 * `algorithm` and `encoding`. Both are optional and defaults to `md5` and
	 * `hex` values.
	 */
	var md5 = function(filepath, algorithm, encoding) {
		algorithm = algorithm || 'md5';
		encoding = encoding || 'hex';
 
		var hash = crypto.createHash(algorithm);
		hash.update(grunt.file.read(filepath));
		grunt.log.verbose.write('Hashing ' + filepath + '...');
 
		return hash.digest(encoding);
	};
 
	/**
	 * The 'md5_content' helper hashes string content directly
	 */
	var md5_content = function(content, algorithm, encoding) {
		content = content.toString();
		algorithm = algorithm || 'md5';
		encoding = encoding || 'hex';
 
		var hash = crypto.createHash(algorithm);
		hash.update(content);
 
		return hash.digest(encoding);
	};

	var usemin = function(type, content, block, dest) {
		var indent = (block.split(linefeed)[0].match(/^\s*/) || [])[0];
		if (type === 'css') {
			return content.replace(block, indent + '<link rel="stylesheet" href="' + dest + '" type="text/css">');
		}
		if (type === 'js') {
			return content.replace(block, indent + '<script src="' + dest + '"></script>');
		}
		return false;
	};

	/**
	 *
	 * Returns an array of all the directives for the given html. Results is
	 * of the following form:
	 *
	 * [{
	 *   type: 'css',
	 *   dest: 'css/site.css',
	 *   src: [ 'css/normalize.css', 'css/main.css' ],
	 *   raw: [ '    <!-- build:css css/site.css -->',
				'    <link rel="stylesheet" href="css/normalize.css">'
	 *          '    <link rel="stylesheet" href="css/main.css">'
	 *          '    <!-- endbuild -->' ]
	 * },
	 * {
	 *    type: 'js',
	 *    dest: 'js/site.js',
	 *    src: [ 'js/plugins.js', 'js/main.js' ],
	 *    raw: [ '    <!-- build:js js/site.js -->',
	 *           '    <script src="js/plugins.js">'
	 *           '    <script src="js/main.js">'
	 *           '    <!-- endbuild -->' ]
	 * }]
	 */
	var getBlocks = function (body) {
		// Start build pattern
		// <!-- build:[type] destination -->
		// TODO: use better regex for dest match
		var regexBuildStart = /<!--\s*build:(\w+)\s*(.+)\s*-->/;
		// End build pattern
		// <!-- endbuild -->
		var regexBuildEnd = /<!--\s*endbuild\s*-->/;
		var regexComment = /<!--(.*)-->/;
		// Match single or double quotes
		var regexSrc = /src=['"]([^"']+)["']/;
		var regexHref = /href=['"]([^"']+)["']/;
	 
		var lines = body.replace(/\r\n/g, '\n').split(/\n/);
		var isBlock = false;
		var sections = [];
		var src;
		var raw;
		var i = 0;
	 
		lines.forEach(function(line) {
			var buildParams = line.match(regexBuildStart);
			var isBuild = regexBuildStart.test(line);
			var isBuildEnd = regexBuildEnd.test(line);
			var isComment = regexComment.test(line);
	 
			if (isBuild) {
				isBlock = true;
				sections[i] = {};
				sections[i].type = buildParams[1].trim();
				sections[i].dest = buildParams[2].trim();
				sections[i].src = src = [];
				sections[i].raw = raw = [];
				i++;
			}
	 
			if (isBlock && raw && src) {
				raw.push(line);
	 
				if (!isComment) {
					if (regexSrc.test(line)) {
						src.push(line.match(regexSrc)[1]);
					}
					if (regexHref.test(line)) {
						src.push(line.match(regexHref)[1]);
					}
				}
	 
				if (isBuildEnd) {
					isBlock = false;
				}
			}
		});
	 
		return sections;
	}

};
 
