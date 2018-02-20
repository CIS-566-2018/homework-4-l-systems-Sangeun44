import {vec3, vec4, mat3} from 'gl-matrix';
import Tree from './geometry/Tree';

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos:vec3, dir:vec3) {
    return {
        pos,
        dir
    }
}

//rotate X direction
var rotateX = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3 {
        vec3.fromValues(1, 0, 0),
        vec3.fromValues(0, c, -s),
        vec3.fromValues(0, s, c)
    }
};

export default class Turtle {
    renderGrammar: String;
    state: any = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));
    scene: Tree;

    constructor(scene: Tree, grammar: String) {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));
        this.scene = scene;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 30, 0, 0),
                '-' : this.rotateTurtle.bind(this, -30, 0, 0),
                'F' : this.makeCylinder.bind(this, 2, 0.1)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }
    
    // Rotate the turtle's _dir_ vector by radians
    rotateTurtle(x: number, y: number, z: number) {
        var e = vec3.fromValues(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        this.state.dir.add(e);
    }

    // Translate the turtle along the input vector.
    moveTurtle(x:number, y:number, z:number) {
	    var new_vec = vec3.fromValues(x, y, z);
	    this.state.pos.add(new_vec);
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist: number) {
        var newVec = this.state.dir.multiplyScalar(dist);
        this.state.pos.add(newVec);
    };
    
    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder(len: number, width: number) {
        // var geometry = new THREE.CylinderGeometry(width, width, len);
        // var material = new THREE.MeshBasicMaterial( {color: 0x00cccc} );
        // var cylinder = new THREE.Mesh( geometry, material );
        // this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = mat4.fromValues();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.character];
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next) {
            this.renderSymbol(currentNode);
        }
    }
}