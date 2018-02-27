import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';

import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import Cylinder from './geometry/Cylinder';
import Tree from './geometry/Tree';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import * as fs from 'fs';

//l-sys
import Lsystem from './lsystem';
import createTree from './lsystem';

//obj
var OBJ = require('webgl-obj-loader');

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shaders: 'lambert',
  shape: 'cube',
  color: [80, 40, 1, 0.9], // CSS string
  tesselations: 5,
  'Load Scene': loadScene // A function pointer, essentially
};

//shapes
let icosphere: Icosphere;
let square: Square;
let cylinder: Cylinder;
let tree: Tree;
let cube: Cube;
let mesh: any;

//  
var verts : Array<number>;
var vertNorm : Array<number>;
var indices : Array<number>;
//time
let count: number = 0.0;

function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
  cube = new Cube(vec3.fromValues(0, 0, 0));
  cube.create();
  cylinder = new Cylinder(vec3.fromValues(0, 0, 0));
  cylinder.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.addColor(controls, 'color');
  gui.add(controls, 'shaders', ['lambert', 'vertex']);
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.add(controls, 'shape', ['cube', 'square', 'icosphere']);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);
  //obj loader
  var objStr = document.getElementById('my_cube.obj').innerHTML;
  mesh = new OBJ.Mesh(objStr); 
  
  //obj loader
  verts = mesh.vertices; //vertices array
  vertNorm = mesh.vertNormals; //vertices normals
  indices = mesh.indices; //indices
    
  console.log("this: " + verts[0] + verts[1] + verts[2] + verts[3]);
  
  //add obj to cylinder obj
  cylinder.addInd(verts);
  cylinder.addNorm(vertNorm);
  cylinder.addPos(verts);

  //OBJ mesh buffer
  OBJ.initMeshBuffers(gl, mesh);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const vertex = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/vertex-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/vertex-frag.glsl')),
  ]);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

 
// use the included helper function to initialize the VBOs
// if you don't want to use this function, have a look at its
// source to see how to use the Mesh instance.
  // const lsys = Lsystem("FX", "S[-FX]+FX", 2.);
  //let expandedGrammar = lsys.createPath

  // This function will be called every frame
  function tick() {
    let new_color = vec4.fromValues(controls.color[0]/256, controls.color[1]/256, controls.color[2]/256, 1);
    
    if(controls.shaders === 'lambert') {
      lambert.setGeometryColor(new_color);  
      
      camera.update();
      stats.begin();
  
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      if(controls.shape === 'cube') {
        renderer.render(camera, lambert, [cube]);
      }
      else if(controls.shape === 'square') {
        renderer.render(camera, lambert, [square]);
      }
      else if(controls.shape === 'icosphere') {
        renderer.render(camera, lambert, [icosphere]);
      }
    }

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();