#!/usr/local/bin/node
'use strict';

var istanbul = require('istanbul');
var fs = require('fs');


var instrumenter = new istanbul.Instrumenter({
	coverageVariable: '__coverage__',
	preserveComments: true
});


var rootPath = process.argv[2];
var outputFilename = process.argv[3];

var saneFileName = fileName.replace('/', '_');

var source = fs.readFileSync(fileName, 'utf8');
source = instrumenter.instrumentSync(source, fileName);

var postamble = `
process.on('beforeExit', () => {
	require('fs').writeFileSync('coverage-${saneFileName}.json', JSON.stringify(__coverage__), 'utf8');
});
`;

fs.writeFileSync(outputFilename, source + `\n\n${postamble}`, 'utf8');

