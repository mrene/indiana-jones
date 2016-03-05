'use strict';

let recast = require('recast'),
	fs = require('fs'),
	types = require('ast-types'),
	n = types.namedTypes,
	b = types.builders,
    _ = require('underscore');

let fileName = process.argv[2];
let coverageFileName = process.argv[3];



let removeNonCoveredNodes = require('./passes/remove-non-covered-nodes'),
    removeEmptyStatements = require('./passes/remove-empty-statements'),
    removeEmptyBlockStatements = require('./passes/remove-empty-block-statements'),
    removeEmptySwitchCases = require('./passes/remove-empty-switch-cases');


let src = fs.readFileSync(fileName, 'utf8');

let cov = JSON.parse(fs.readFileSync(coverageFileName, 'utf8'));
cov = cov[fileName];

let ast = recast.parse(src);
ast = removeNonCoveredNodes(ast, cov);
ast = removeEmptyStatements(ast);
ast = removeEmptyBlockStatements(ast);
ast = removeEmptySwitchCases(ast);


var saneFileName = fileName.replace('/', '_');
fs.writeFileSync(`clean-${saneFileName}.js`, recast.print(ast).code);
