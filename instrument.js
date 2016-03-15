'use strict';

var istanbul = require('istanbul');
var fs = require('fs');


function instrument(file, enc, out) {
  var instrumenter = new istanbul.Instrumenter({
    coverageVariable: `__coverage__`,
    preserveComments: true
  });

  fs.readFile(file, 'utf8', function(err, content) {
    source = instrumenter.instrumentSync(content, file);

    fs.writeFileSync(out, source + `\n\n${postamble}`, 'utf8');
  });
}



module.exports = instrument;