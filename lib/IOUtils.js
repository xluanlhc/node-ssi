
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

module.exports = (function() {
	"use strict";

	var IOUtils = function(documentRoot) {
		this.documentRoot = documentRoot;
	};

	IOUtils.prototype = {

		/* Public Methods */

		/**
		 * Resolve the file path in the include directive
		 * @param currentFile the file being processed/parsed
		 * @param includedFile the file being included in currentFile
		 * @param inclType include type, can only be virtual or file (default)
		 * @return the resolved path
		 */
		resolveFullPath: function(currentFile, includedFile, inclType) {
			inclType = inclType || 'file';
			if(inclType !== 'virtual' && inclType !== 'file') {
				throw new Error('inclType must be either "virtual" or "file" (default)');
			}

			return inclType === 'virtual'?
				path.resolve(this.documentRoot, includedFile.replace(/^[\/]/, '')):
				path.resolve(path.dirname(currentFile), includedFile);
		},

		/**
		 * Read the included file
		 * @param currentFile the file being processed/parsed
		 * @param includedFile the file being included in currentFile
		 * @param inclType include type, can only be virtual or file (default)
		 * @return the file content string
		 */
		readIncludeSync: function(currentFile, includedFile, inclType) {
			inclType = inclType || 'file';
			if(inclType !== 'virtual' && inclType !== 'file') {
				throw new Error('inclType must be either "virtual" or "file" (default)');
			}

			let resolvedPath = inclType === 'virtual'?
				path.resolve(this.documentRoot, includeFile.replace(/^[\/]/, '')):
				path.resolve(path.dirname(currentFile), includedFile);

			return fs.readFileSync(resolvedPath, {encoding: "utf8"});
		},

		readFileSync: function(currentFile, includeFile) {
			return fs.readFileSync(this.resolveFullPath(currentFile, includeFile, 'file'), {encoding: "utf8"});
		},

		readVirtualSync: function(currentFile, includeFile) {
			return fs.readFileSync(this.resolveFullPath(currentFile, includeFile, 'virtual'), {encoding: "utf8"});
		},

		writeFileSync: function(filename, contents) {
			var directory = path.dirname(filename);

			if (!fs.existsSync(directory)) {
				// If the file's directory doesn't exists, recursively create it
				//noinspection JSUnresolvedFunction
				mkdirp.sync(directory);
			}

			fs.writeFileSync(filename, contents, {encoding: "utf8"});
		}

		/* Private Methods */
	};

	// Export the IOUtils class for use
	return IOUtils;
})();
