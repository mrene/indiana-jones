'use strict';

let types = require('ast-types');

function removeEmptyBlockStatements(ast) {

	types.visit(ast, {
	    // Remove empty block statements "{}"
	    visitBlockStatement: function(path) {
	        if (path.node.body.length === 0) {
	        	console.log(path.parent.node.type);
	        	if (path.parent.node.type === 'FunctionExpression' ||
	        		path.parent.node.type === 'FunctionDeclaration') {
	        		// Get rid of params for more readability
	        		path.parent.node.params = [];
	        	} else  if (path.parent.node.type === 'IfStatement') {
	            	path.parent.node[path.name] = null;
	        	}
	            return false;
	        }

	        this.traverse(path);
	    }
	});

	return ast;
}

module.exports = removeEmptyBlockStatements;
