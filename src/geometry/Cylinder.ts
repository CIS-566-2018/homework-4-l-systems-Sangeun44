import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

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
  }

  addInd(one: Array<number>) {
    for(var i = 0; i < one.length; ++i) {
        this.ind.push(one[i]);
      }
  }
  
  addNorm(one: Array<number>) {
    for(var i = 0; i < one.length; ++i) {
        this.norm.push(one[i]);
      }  
  }

  addPos(one: Array<number>) {
    for(var i = 0; i < one.length; ++i) {
        this.pos.push(one[i]);
      }  
  }

  create() {

  this.indices = Uint32Array.from(this.ind);
  this.normals = Float32Array.from(this.norm);
  this.positions = Float32Array.from(this.pos);

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

export default Tree;
