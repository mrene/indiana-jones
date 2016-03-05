'use strict';

let recast = require('recast'),
	fs = require('fs'),
	types = require('ast-types'),
	n = types.namedTypes,
	b = types.builders,
    _ = require('underscore');


function removeEmptyStatements(ast) {
	// Ugly hack - print doesn't emit empty statements
	ast = recast.parse(recast.print(ast).code);

	return ast;
}

module.exports = removeEmptyStatements;