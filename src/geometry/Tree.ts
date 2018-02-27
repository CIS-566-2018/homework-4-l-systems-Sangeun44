import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Cylinder from './Cylinder';

class Tree extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;

  ind : Array<number>;
  pos : Array<number>;
  norm : Array<number>;
  
  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.indices = new Uint32Array([]);
    this.positions = new Float32Array([]);
    this.normals = new Float32Array([]);

    this.ind = new Array<number>();
    this.pos = new Array<number>();
    this.norm = new Array<number>(); 
  }

  addCylinder(cyl: Cylinder) {
    var objInd = new Array<number>();
    objInd = cyl.getInd();
    var objNorm = new Array<number>();
    objNorm = cyl.getNorm();
    var objPos = new Array<number>();
    objPos = cyl.getPos();

    for(var i = 0; i < objPos.length; ++i) {
      this.pos.push(objPos[i]);
      console.log("pos:" + objPos[i]);
    } 
    for(var i = 0; i < objNorm.length; ++i) {
      this.norm.push(objNorm[i]);
      console.log("norms:" + objNorm[i]);
    } 
    
    if(this.ind.length > 0) {
      var lastInd = this.ind[3];
    } else {
      var lastInd = 0;
    }
    console.log("beg Ind: " + lastInd);
    for(var i = 0; i < objInd.length; ++i) {
      this.ind.push(objInd[i] + lastInd);
      console.log("ind:" + objInd[i]);
    }

  }

  create() {
    this.indices = Uint32Array.from(this.ind);
    this.positions = Float32Array.from(this.pos);
    this.normals = Float32Array.from(this.norm);

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

    console.log(`Created Tree`);
  }
};

export default Tree;
