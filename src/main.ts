import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';

import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import Cylinder from './geometry/Cylinder';
import Flower from './geometry/flower';
import Tree from './geometry/Tree';
import Base from './geometry/Base';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
//import * as fs from 'fs';

//l-sys
import Lsystem from './lsystem';

//turtle
import Turtle from './turtle';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shaders: 'lambert',
  shape: 'tree',
  color: [255, 0, 105, 1.0], // CSS string
  tesselations: 5,
  'Load Scene': loadScene // A function pointer, essentially
};

//shapes
let icosphere: Icosphere;
let square: Square;
let cylinder: Cylinder;
let cube: Cube;
let flower: Flower;
let tree: Tree;
let base: Base;

//time
let count: number = 0.0;

function loadScene() {
  cylinder = new Cylinder(vec3.fromValues(0,0,0));
  cylinder.create();
  tree.create();
  flower = new Flower(vec3.fromValues(0,0,0));
  flower.create();
  base = new Base(vec3.fromValues(0,0,0));
  base.create();
  square = new Square(vec3.fromValues(0,0,0));
  square.create();
}

function main() {
  //lsystem
  var axiom = "FFFFFFFFFFFFFX";
  var iteration = 2;
  var lsys = new Lsystem(axiom, iteration);
  var path = lsys.createPath(); //create string path
  console.log(path);

  tree = new Tree(vec3.fromValues(0,0,0));

  //turle action
  var turtle = new Turtle(tree, path);
  turtle.draw();

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
  gui.add(controls, 'shaders', ['lambert']);
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.add(controls, 'shape', ['tree']);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();
  
  const camera = new Camera(vec3.fromValues(500, 300, 50), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.3, 0.7, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);

  const vertex = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/vertex-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/vertex-frag.glsl')),
  ]);

  const tree_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const base_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/base-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/base-lambert-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    let new_color = vec4.fromValues(controls.color[0]/256, controls.color[1]/256, controls.color[2]/256, 1);
    let base_color = vec4.fromValues(62/256, 243/256, 255/256, 1);
      tree_lambert.setGeometryColor(new_color);  
      camera.update();
      stats.begin();
  
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      //renderer.render(camera, tree_lambert, [flower]);
      renderer.render(camera, tree_lambert, [tree]);

      base_lambert.setGeometryColor(base_color);
      renderer.render(camera, base_lambert, [base, square]);
      //tester cylinder
      //renderer.render(camera, tree_lambert, [flower]);

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

