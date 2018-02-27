import { Dictionary } from "lodash";

var Loader = require('webgl-obj-loader');
Loader.downloadMeshes({
	'cyl' : 'shapes/cylinder.obj'}, 
	function() {}
);

// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob: number, str: String) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

export function createTree() {
	
}
export default function Lsystem(axiom: String, grammar: String, iterations: number) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		Rule(1.0, 'S[-FX]+FX')
	];
	this.iterations = 0; 
	
	// Set up the axiom string
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Set up iterations (the number of times you 
	// should expand the axiom in DoIterations)
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// A function to alter the axiom string stored 
	// in the L-system
	this.updateAxiom = function(axiom: String) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}
	//A function to alter the grammar string stored 
	//in the L-system
	this.updateGrammar = function(grammar: String) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.grammar = grammar;
		}
	}

	//this will return the expanded string in array form
	this.createPath = function() {
		var startArray = this.axiom.split("");
		var endArray = {};
		var it = this.iterations;
		for(var i = 0; i < it; ++i) {
			endArray = this.processString(startArray);
			startArray = endArray;
		}
		return endArray;
	  }
	  
	  this.processString = function(array: Array<string>) {
		var newString = "";
		for(var i = 0; i < array.length; ++i) {
			var c = array[i];
			newString = newString + this.applyRules(c);
		}
		return newString;
	  }
	  
	  this.applyRules = function(c : string) {
		var newString = "";
		if(c == 'X') {
			var mapped = this.grammar['X']; //get string attached
			newString = mapped;
		}
		else {
			newString = c;
		}
		return newString;
	  }
}