import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import Tree from './geometry/Tree';

var Quaternion = require('quaternion');

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos:vec3, dir:vec3, depth:number) {
    return {
        pos,
        dir,
        depth
    }
}

//rotate X direction
var rotateX = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues (
       1, 0, 0,
       0, c, -s,
        0, s, c,
    )
};

//rotate X direction
var rotateX = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues (
       1, 0, 0,
       0, c, -s,
        0, s, c,
    )
};

//Rotation matrix around the Y axis.
var rotateY = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues(
        c, 0, s,
        0, 1, 0,
        -s, 0, c
    )
};

//Rotation matrix around the Z axis.
var rotateZ = function(theta:number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues(
        c, -s, 0, 
        s, c, 0,
        0, 0, 1
    )
};

export default class Turtle {
    state: any = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 0);
    scene: Tree;

    constructor(scene: Tree, grammar: String) {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 0);
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 0);        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
        console.log(this.state.depth)
    }
    
    // Rotate the turtle's _dir_ vector by angles
    rotateTurtle(x: number, y: number, z: number) {
        var rotX = rotateX(x);
        var rotY = rotateY(y);
        var rotZ = rotateZ(y);

        this.state.dir.applyMatrix(rotX);
        this.state.dir.applyMatrix(rotY);
        this.state.dir.applyMatrix(rotZ);
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
    
}