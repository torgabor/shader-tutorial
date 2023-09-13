import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import frag from './shaders/normals.frag';
import vert from './shaders/normals.vert';



// Initialize dat.GUI
const gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader();
const diffMap = textureLoader.load('textures/brick_wall2-diff-512.jpg')
const normalMap = textureLoader.load('textures/brick_wall2-nor-512.jpg');
const specularMap = textureLoader.load('textures/brick_wall2-spec-512.jpg');
// Create scene
const scene = new THREE.Scene();
console.log(frag);
console.log(vert);
// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const settings = {
  lightDirectionX: 1,
  lightDirectionY: 1,
  lightDirectionZ: 1,
  lightColor: '#ffffff', // default white light
  ambientColor: '#3a3a3a', // default white light
  rotate: false
};

// Create geometry
const geometry = new THREE.BoxGeometry(3, 3, 3);

geometry.computeTangents();

// Create material
const material = new THREE.ShaderMaterial({
  vertexShader: vert,
  fragmentShader: frag,
  uniforms: {
    lightDirection: { value: new THREE.Vector3(settings.lightDirectionX, settings.lightDirectionY, settings.lightDirectionZ).normalize() },
    cameraPositionWorld: { value: camera.position },
    lightColor: { value: new THREE.Color(settings.lightColor) },
    ambientColor: { value: new THREE.Color(settings.ambientColor) },
    diffMap: { value: diffMap },
    normalMap: { value: normalMap },
    specularMap: { value: specularMap }
  }
});
// Update the material whenever the color is changed
function updateLightDirection() {
  material.uniforms.lightDirection.value.set(settings.lightDirectionX, settings.lightDirectionY, settings.lightDirectionZ);
}


// Create a color controller in the GUI
const lightDirectionFolder = gui.addFolder('Light Direction');
lightDirectionFolder.add(settings, 'lightDirectionX', -1, 1).onChange(updateLightDirection);
lightDirectionFolder.add(settings, 'lightDirectionY', -1, 1).onChange(updateLightDirection);
lightDirectionFolder.add(settings, 'lightDirectionZ', -1, 1).onChange(updateLightDirection);

// For Light Color
const lightColorController = gui.addColor(settings, 'lightColor').onChange((color) => {
  material.uniforms.lightColor.value.set(color);
});
gui.add(settings, 'rotate').listen();



// Create mesh
const cube = new THREE.Mesh(geometry, material);
const controls = new OrbitControls(camera, renderer.domElement)

// Add cube to scene
scene.add(cube);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  material.uniforms.cameraPositionWorld.value = camera.position;
  // Rotate cube
  if (settings.rotate) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }


  // Render scene with camera
  renderer.render(scene, camera);
};

animate();
