import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add stuff here
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const SunMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xfff700, 
});

const Sun = new THREE.Mesh(sphereGeometry, SunMaterial);
Sun.scale.setScalar(5);
scene.add(Sun);

const EarthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue',
});

const Earth = new THREE.Mesh(sphereGeometry, EarthMaterial);
Earth.position.x = 10;
scene.add(Earth);

const MoonMaterial = new THREE.MeshBasicMaterial({
  color: 'grey',
});

const Moon = new THREE.Mesh(sphereGeometry, MoonMaterial);
Moon.position.x = 2;
Moon.scale.setScalar(0.3);
Earth.add(Moon);
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// initialize the Clock
const clock = new THREE.Clock();


// render loop
const renderloop = () => {

  const elapsedTime = clock.getElapsedTime();

  Earth.rotation.y += 0.01;
  Earth.position.x =  Math.sin(elapsedTime)* 10
  Earth.position.z =  Math.cos(elapsedTime)* 10

  Moon.position.x = Math.sin(elapsedTime)* 2
  Moon.position.z = Math.cos(elapsedTime)* 2

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
