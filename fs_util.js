var fs = require('fs');
var Minimatch = require('minimatch').Minimatch;
var path = require('path');

/**
 * Helper to check a file name against a list of globs.
 * @param  {string}  filename  The file name or path.`
 * @param  {array}   globs     An array of globs to match against.
 *
 * @return {Boolean}
 */
function _isIgnored(filename, globs) {
  if (!globs.length) return false;

  return globs.some(function(glob) {
    return glob.match(filename);
  });
}

var fileList = [];

/**
 * The heart of the walker. Skips over empty dirs and uses globs
 * to ignore directories.
 * @param {string}    dir      Root dir to start the walk from.
 * @param {array}     ignore   An array of glob objects.
 * @param {function}  done     This is pretty self explanatory.
 */
function _walk(dir, ignore, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);

    var pending = list.length;
    if (!pending) return done(null, fileList);

    list.forEach(function(file) {
      if (_isIgnored(file, ignore)) {
        if (!--pending) done(null, fileList);
        return;
      }

      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          _walk(file, ignore, function(err, res) {
            fileList = results.concat(res);
            if (!--pending) done(null, fileList);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, fileList);
        }
      });
    });
  });
}

/**
 * Recursively walks a directory, breadth first, in serial loop fashion.
 * Modified version of this: http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 * @param  {string}   dir     The base director to start the walk from. Can be relative or absolute.
 * @param  {array}    ignore  An array of files or folders to ignore.
 * @param  {function} done    The callback to call when the walk is finished. Recieves an array of file paths.
 */
var walk = function(dir, ignore, done) {
  ignore = ignore || [];
  fileList = [];

  ignore = ignore.map(function(pattern) {
    return new Minimatch(pattern);
  });

  return _walk(dir, ignore, done);
};

module.exports = walk;