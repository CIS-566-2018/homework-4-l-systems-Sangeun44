import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import Tree from './geometry/Tree';
import Cylinder from './geometry/Cylinder';
import Flower from './geometry/flower';

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

export default class Turtle {
    state: any = TurtleState(vec3.fromValues(0,0,0), vec3.fromValues(1,1,1));
    tree: Tree;
    path: string;
    tree2: Tree;
    height: number;

    constructor(tree: Tree, tree2: Tree, path: string, height: number) {
        this.state = TurtleState(vec3.fromValues(0,150,0), vec3.fromValues(0,1,0));
        this.tree = tree;
        this.tree2 = tree2;
        this.path = path;
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
    rotateTurtle(axis: vec3, x : number) {
       //matrices
        var rotMat = this.rotationMatrix(axis, x);
        var changedDir = vec3.create();
        vec3.transformMat4(changedDir, this.state.dir, rotMat);
        vec3.normalize(changedDir, changedDir);
        if(changedDir[1] > 0) {
            this.state.dir = changedDir;
        }
        // this.state.dir = vec3.fromValues(new1, new2, new3);
    }

    translateVertices(positions: Array<number>) {
        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom + this.state.pos[0], yCom + this.state.pos[1], zCom+ this.state.pos[2]);

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            // console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
        }
        return newPositions;
    }

    rotateVertices(x: number, positions: Array<number>) {
        var dirX = this.state.dir[0];
        var dirY = this.state.dir[1];
        var dirZ = this.state.dir[2];

        var rotMat = this.rotationMatrix(this.state.dir, x);

        //matrices

        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom, yCom, zCom);
            vec3.transformMat4(vert, vert, rotMat);           

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
        }
        return newPositions;
    }

    scaleVertices(positions : Array<number>, scale: number) {
        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom * scale, yCom * scale, zCom * scale);

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
        }
        return newPositions;
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
        //turtleState stack
        var stackP = new Array<vec3>();
        var stackD = new Array<vec4>();

        //random values
        var width = 80;
        var dist = 10;
        console.log("height: " + this.height);

        for(var i = 0; i < this.path.length; ++i) {
            var currentChar = this.path.charAt(i);
            console.log("currentChar:" + currentChar);
            if(currentChar === "F") {
                if(i !== 0) {
                var check = Math.floor(Math.random() * 100) + 2;
                if(check < 10) {
                    var rand1 = Math.floor(Math.random() * 10) + 1;  
                    //change angle while going forward
                    var axis = vec3.fromValues(1,0,0);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                    axis = vec3.fromValues(0,1,0);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                    axis = vec3.fromValues(0,0,1);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                }
            }
                //make a forward cylinder
                var cylinder = new Cylinder(vec3.fromValues(0, 0, 0));
                
                //CHANGE vertices depending on direction of the turtle
                var posArr = cylinder.getPos();
                posArr = this.scaleVertices(posArr, width);
                posArr = this.rotateVertices(20, posArr);
                posArr = this.translateVertices(posArr);
                cylinder.setPos(posArr);
                //add to tree
                this.tree.addCylinder(cylinder);
                
                //update turtle
                this.moveForward(dist);
            }
            else if(currentChar === "S") {
                //save turtle state
                stackP.push(this.state.pos);
                stackD.push(vec4.fromValues(this.state.dir[0], this.state.dir[1], this.state.dir[2], 1));
            }
            else if(currentChar === "[") {
                //start branch    
                var check = Math.floor(Math.random() * 100);
                if(check > 80) {
                    var rand1 = Math.floor(Math.random() * 2) + 1;  
                    if(width - rand1 > 0) {
                        width -= rand1;
                    }
                }
                dist -= 1;
            }
            else if(currentChar === "]") {
                //change width/scale
                var check = Math.floor(Math.random() * 100);
                if(check > 80) {
                    var rand1 = Math.floor(Math.random() * 5) + 1;  
                    if(width + rand1 < 40) {
                        width += rand1;
                    }
                } 
                dist += 1;
                //return to Save point
                this.state.pos = stackP.pop();
                var dir = stackD.pop();
                this.state.dir = vec3.fromValues(dir[0], dir[1], dir[2]);
            }
            else if(currentChar === "X") {
                var check = Math.floor(Math.random() * 100);  
                if(check > 40) {
                    var flower = new Flower(vec3.fromValues(0, 0, 0));
                    posArr = flower.getPos();   
                    posArr = this.scaleVertices(flower.getPos(), 90);
                    posArr = this.rotateVertices(40, flower.getPos());
                    posArr = this.translateVertices(posArr);
                    flower.setPos(posArr);
                    this.tree2.addFlower(flower);
                }
            }
            else if(currentChar === "+") {
                var max = 20; 
                var min = 0;
                //change angle
                var check = Math.floor(Math.random() * 100);  
                if(check > 40) {
                    var rand1 = Math.floor(Math.random() * max) - min;  
                    var axis = vec3.fromValues(1,0,1);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                } 
                else if(check > 70) {
                    var rand1 = Math.floor(Math.random() * max) - min;  
                    var axis = vec3.fromValues(1,0,0);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                    axis = vec3.fromValues(0,1,0);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                    axis = vec3.fromValues(0,0,1);
                    this.rotateTurtle(axis, rand1); //rotate direction of the turtle                      
                } 
           
            }
            else if(currentChar === "-") {
                var max = 20; 
                var min = 0;        
                //change angle
                        var check = Math.floor(Math.random() * 100);  
                        if(check > 50) {
                            var rand1 = Math.floor(Math.random() * max) - min ;  
                            var axis = vec3.fromValues(1,0,1);
                            this.rotateTurtle(axis, rand1); //rotate direction of the turtle                        
                        } 
                        else if(check > 70) {
                            var rand1 = Math.floor(Math.random() * max) - min;  
                            var axis = vec3.fromValues(1,0,0);
                            this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                            axis = vec3.fromValues(0,1,0);
                            this.rotateTurtle(axis, rand1); //rotate direction of the turtle
                            axis = vec3.fromValues(0,0,1);
                            this.rotateTurtle(axis, rand1); //rotate direction of the turtle                    
                        } 
            }
        }
    }
    //rotate X direction
rotateX = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues (
       1, 0, 0,
       0, c, -s,
        0, s, c,
    )
};

//Rotation matrix around the Y axis.
rotateY = function(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues(
        c, 0, s,
        0, 1, 0,
        -s, 0, c
    )
};

//Rotation matrix around the Z axis.
rotateZ = function(theta:number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    return mat3.fromValues(
        c, -s, 0, 
        s, c, 0,
        0, 0, 1
    )
}

rotationMatrix = function(axis : vec3 , angle:number)
{
    axis = vec3.normalize(axis, axis);
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var oc = 1.0 - c;
    
    return mat4.fromValues(oc * axis[0] * axis[0] + c,           oc * axis[0] * axis[1] - axis[2] * s,  oc * axis[2] * axis[0] + axis[1] * s,  0.0,
                oc * axis[0] * axis[1] + axis[2] * s,  oc * axis[1] * axis[1] + c,           oc * axis[1] * axis[2] - axis[0] * s,  0.0,
                oc * axis[2] * axis[0] - axis[1] * s,  oc * axis[1] * axis[2] + axis[0] * s,  oc * axis[2] * axis[2] + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}     
}