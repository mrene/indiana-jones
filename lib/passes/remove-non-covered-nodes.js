'use strict';

let types = require('ast-types'),
	b = types.builders;

function removeNonCoveredNodes(ast, cov) {
	// Remove nodes that are not covered by coverage
	let forward = function(path) { return this.coverStatement(path); };
	let forwardFunction = function(path) { return this.coverFunction(path); };
	types.visit(ast, {

	    visitExpressionStatement: forward,
	    // visitBreakStatement: forward,
	    visitContinueStatement: forward,
	    visitDebuggerStatement: forward,
	    visitReturnStatement: forward,
	    visitThrowStatement: forward,
	    visitTryStatement: forward,
	    visitVariableDeclaration: forward,
	    visitIfStatement: forward,
	    visitForStatement: forward,
	    visitForInStatement: forward,
	    visitForOfStatement: forward,
	    visitWhileStatement: forward,
	    visitDoWhileStatement: forward,
	    visitSwitchStatement: forward,
	    visitWithStatement: forward,
	    visitLabeledStatement: forward,

		visitFunctionDeclaration: forwardFunction,
	    visitFunctionExpression: forwardFunction,

	    coverStatement: function(path) {
	    	

	    	if (!this.isCovered(path)) {
	    		
	    		// console.log(path.node.type, path.node.loc);
	    		// console.log('Would remove: ', recast.print(path.node).code);

	    		path.replace(b.emptyStatement());

	    		// eval(require('locus'));

	    		return false;
	    	}

	    	this.traverse(path);
	    },

	    coverFunction: function(path) {
	    	// console.log(path.node.type, path.node.loc);
			this.traverse(path);
	    },

	    isCovered: function(path) {
	    	var statementId = this.findStatementId(path.node.loc);
	    	// console.log('statementId', statementId, cov.s[statementId]);
	    	return cov.s[statementId] > 0;
	    },

	    findStatementId: function(loc) {
	    	var map = cov.statementMap;
	    	var keys = Object.keys(map).filter((key) => 
	    		map[key].start.line === loc.start.line && 
	    		map[key].start.column === loc.start.column //&&
	    		// map[key].end.line === loc.end.line && 
	    		// map[key].end.column === loc.end.column
	    		);

	    	return keys[0];
	    }

	    /* The following have been left out (temporarily):
	     * - ConditionalExpression
	     * - LogicalExpression
	     */
	});

	return ast;
}

module.exports = removeNonCoveredNodes;
