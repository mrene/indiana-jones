'use strict';

let types = require('ast-types'),
    _ = require('underscore');


function removeEmptySwitchCases(ast) {

	types.visit(ast, {
	    // Simplify: Empty switch cases
	    visitSwitchStatement: function(path) {
	        var node = path.node;

	        // Go through all the cases; if a statement is found, skip, if a break is found without any statements, remove the case completely
	        for (var i = 0; i < node.cases.length; i++) {
	            var caseNode = node.cases[i];
	            if (caseNode.consequent.length !== 0 && caseNode.consequent[0].type !== 'BreakStatement') {
	                continue; /* Skip this one */
	            }

	            delete node.cases[i];
	        }

	        node.cases = _.compact(node.cases);

	        this.traverse(path);
	    }
	});

	return ast;
}

module.exports = removeEmptySwitchCases;
