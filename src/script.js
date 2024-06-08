import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { distance } from "three/examples/jsm/nodes/Nodes.js";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize texture loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");

// initialize materials
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

// initialize geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const SunMaterial = new THREE.MeshBasicMaterial({ 
  map: sunTexture, 
});

const Sun = new THREE.Mesh(sphereGeometry, SunMaterial);
Sun.scale.setScalar(5);
scene.add(Sun);

const Planets = [
  {  
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material : earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: 'Mars',
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material : marsMaterial,
    moons: [
      {
        name: 'Phobos',
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: 'Deimos',
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name: 'Venus',
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material : venusMaterial,
    moons: [],
  },
  {
    name: 'Mercury',
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material : mercuryMaterial,
    moons: [],
  }
];

const createPlanet = (planet) => {
  // create planets 
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;  
  return planetMesh;
};

const createMoon = (moon) => { 
  // create moons 
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;

}

const planetMeshes = Planets.map((planet) => {
  // add planets to the scene
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  // add moons to the planets
  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

// initialize the light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

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

// render loop
const renderloop = () => {

  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += Planets[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * Planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * Planets[index].distance;

    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += Planets[index].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y) * Planets[index].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y) * Planets[index].moons[moonIndex].distance;
    });

  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();
