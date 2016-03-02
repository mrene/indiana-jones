'use strict';

let recast = require('recast'),
	fs = require('fs'),
	types = require('ast-types'),
	n = types.namedTypes,
	b = types.builders;

let fileName = process.argv[2];
let coverageFileName = process.argv[3];


let src = fs.readFileSync(fileName, 'utf8');
let cov = JSON.parse(fs.readFileSync(coverageFileName, 'utf8'));
let ast = recast.parse(src);

var forward = function(path) { return this.coverStatement(path); };
var forwardFunction = function(path) { return this.coverFunction(path); };

cov = cov[fileName];


// Remove nodes that are not covered by coverage
types.visit(ast, {

    visitExpressionStatement: forward,
    visitBreakStatement: forward,
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
    		
    		console.log(path.node.type, path.node.loc);
    		console.log('Would remove: ', recast.print(path.node).code);

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

    	if (keys.length > 1) {
    		console.warn('Uh oh', keys);
    	}

    	// console.log('key', keys[0]);
    	return keys[0];
    }

    /* The following have been left out (temporarily):
     * - ConditionalExpression
     * - LogicalExpression
     */
});

var saneFileName = fileName.replace('/', '_');

fs.writeFileSync(`clean-${saneFileName}.js`, recast.print(ast).code);

