import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
//obj
var OBJ = require('webgl-obj-loader');

class Cylinder extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  
  mesh: any;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.indices = new Uint32Array([]);
    this.positions = new Float32Array([]);
    this.normals = new Float32Array([]);

     //obj loader
    var objStr = document.getElementById('my_cube.obj').innerHTML;
    this.mesh = new OBJ.Mesh(objStr); 
  }

//   addInd(one: Array<number>) {
//     for(var i = 0; i < one.length; ++i) {
//         this.ind.push(one[i]);
//       }
//   }
  
//   addNorm(one: Array<number>) {
//     for(var i = 0; i < one.length; ++i) {
//         this.norm.push(one[i]);
//       }  
//   }

//   addPos(one: Array<number>) {
//     for(var i = 0; i < one.length; ++i) {
//         this.pos.push(one[i]);
//       }  
//   }

  create() {
    var objInd = new Array<number>();
    var objPos = new Array<number>();
    var objNorm = new Array<number>();
    
    objInd = this.mesh.indices;
    console.log("ind" + objInd[0]);
    
    // //normals
    for(var i = 0; i < this.mesh.vertexNormals.length; i + 3) {
        objNorm.push(this.mesh.vertexNormals[i]);
        objNorm.push(this.mesh.vertexNormals[i+1]); 
        objNorm.push(this.mesh.vertexNormals[i+2]);
        objNorm.push(0);
    }  

    // //vertex positions
    // for(var i = 0; i < this.mesh.vertices.length; i + 3) {
    //     console.log("vertices:" + this.mesh.vertices[i] + this.mesh.vertices[i+1] + this.mesh.vertices[i+2] +  1);
    //     objPos.push(this.mesh.vertices[i], this.mesh.vertices[i+1], this.mesh.vertices[i+2], 1);
    // }  

  // this.indices = Uint32Array.from(objInd);
  // this.normals = Float32Array.from(objNorm);
  // this.positions = Float32Array.from(objPos);

  //OBJ mesh buffer
  //OBJ.initMeshBuffers(gl, this.mesh);

  this.indices = new Uint32Array([0, 1, 2,
    0, 2, 3
    ]);
  this.normals = new Float32Array([0, 0, 1, 0,
       0, 0, 1, 0,
       0, 0, 1, 0,
       0, 0, 1, 0,
       ]);
  this.positions = new Float32Array([-1, -1, 0, 1,
         1, -1, 0, 1,
         1, 1, 0, 1,
         -1, 1, 0, 1,
        ]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cylinder`);
  }
};

export default Cylinder;
