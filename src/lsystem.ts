import { Dictionary } from "lodash";
import * as OBJ from 'webgl-obj-loader';

var gl = canvas.getContext('webgl');
var objStr = document.getElementById('my_cube.obj').innerHTML;
var mesh = new OBJ.Mesh(objStr);
 
// use the included helper function to initialize the VBOs
// if you don't want to use this function, have a look at its
// source to see how to use the Mesh instance.
OBJ.initMeshBuffers(gl, mesh);
// have a look at the initMeshBuffers docs for an exmample of how to
// render the model at this point

// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob: number, str: String) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
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

	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var lSystemLL = StringToLinkedList(this.axiom);
		return lSystemLL;
	}
}