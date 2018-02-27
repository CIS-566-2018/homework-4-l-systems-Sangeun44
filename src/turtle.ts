import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import Tree from './geometry/Tree';
import Cylinder from './geometry/Cylinder';

var Quaternion = require('quaternion');

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos:vec3, dir:vec3) {
    return {
        pos,
        dir,
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
    state: any = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));
    tree: Tree;
    path: string;
    stack: [0];

    constructor(tree: Tree, path: string) {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));
        this.tree = tree;
        this.path = path;
        this.stack = [0];
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log("pos: " + this.state.pos)
        console.log("dir: " + this.state.dir)
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
        var pos = this.state.pos;
        var newVec = vec3.fromValues(x,y,z);
        this.state.pos = vec3.fromValues(pos[0] + newVec[0], pos[1] + newVec[1], pos[2] + newVec[2]);
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist: number) {
        var pos = this.state.pos;
        var dir = this.state.dir;

        var newVec = vec3.fromValues(0,0,0);
        newVec = vec3.fromValues(dir[0] * dist, dir[1] * dist, dir[2] * dist);
        this.state.pos = vec3.fromValues(pos[0] + newVec[0], pos[1] + newVec[1], pos[2] + newVec[2]);
    };
    
    //draw the cylinders and put into the tree
    draw() {
        for(var i = 0; i < 5; ++i) {
            var currentChar = this.path.charAt(i);
            console.log("currentChar:" + currentChar);
            if(currentChar === "F") {
                //make a forward cylinder
                var cylinder = new Cylinder(vec3.fromValues(this.state.pos[0], this.state.pos[1], this.state.pos[2]));
                var posArr = cylinder.getPos();
                this.printState();
                // for(var j = 1; j < posArr.length; j = j + 4) {
                //     posArr[j] = posArr[j] + this.state.pos[1] + 2;
                // }
                //cylinder.setPos(posArr);
                console.log("NEW: " + posArr[0] + ", " +  posArr[1] + ", " + posArr[2] +  ", " + posArr[3]);
                this.tree.addCylinder(cylinder);
                //update turtle
                this.moveForward(2);
                this.printState();
            }
            else if(currentChar === "S") {
                this.stack.push(this.state);
            }
            else if(currentChar === "[") {

            }
            else if(currentChar === "]") {

            }
            else if(currentChar === "X") {

            }
            else if(currentChar === "+") {

            }
            else if(currentChar === "-") {

            }
        }
    }
}