import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// import frag from './shaders/simple.frag';
// import vert from './shaders/simple.vert';

// import frag from './shaders/textured.frag';
// import vert from './shaders/textured.vert';

//  import frag from './shaders/diffuse.frag';
//  import vert from './shaders/diffuse.vert';

// import frag from './shaders/textured.frag';
// import vert from './shaders/textured.vert';

import frag from './shaders/normals.frag';
import vert from './shaders/normals.vert';


async function main() {


  // Initialize dat.GUI
  const gui = new dat.GUI();

  const textureLoader = new THREE.TextureLoader();

  const diffCrab = textureLoader.load('/textures/T_Crab_Body_Merged_BC.png')
  const normalCrab = textureLoader.load('textures/T_Crab_Body_Merged_N.png');
  const specularCrab = textureLoader.load('/textures/T_Crab_Body_Merged_R.png');

  const diffMap = textureLoader.load('textures/brick_wall2-diff-512.jpg')
  const normalMap = textureLoader.load('textures/brick_wall2-nor-512.jpg');
  const specularMap = textureLoader.load('textures/brick_wall2-spec-512.jpg');
  // Create scene
  const scene = new THREE.Scene();
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
    objectToggle: false,
    lightColor: '#ffffff', // default white light
    ambientColor: '#3a3a3a', // default white light
    rotate: false
  };

  // Create geometry
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  geometry.computeTangents();

  const gltfLoader = new GLTFLoader();

  const crabObject = (await gltfLoader.loadAsync('models/crab.glb')).scene;

  let crabGeometry: THREE.BufferGeometry = (crabObject.children[0] as THREE.Mesh).geometry;
  //Use helper function to create indexed version of the geometry
  crabGeometry.computeTangents();
  // Create material
  const cubeMaterial = new THREE.ShaderMaterial({
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
  let material: THREE.ShaderMaterial;
  let mesh: THREE.Mesh;

  const crabMaterial = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      lightDirection: { value: new THREE.Vector3(settings.lightDirectionX, settings.lightDirectionY, settings.lightDirectionZ).normalize() },
      cameraPositionWorld: { value: camera.position },
      lightColor: { value: new THREE.Color(settings.lightColor) },
      ambientColor: { value: new THREE.Color(settings.ambientColor) },
      diffMap: { value: diffCrab },
      normalMap: { value: normalCrab },
      specularMap: { value: specularCrab }
    }
  });
  // Update the material whenever the color is changed
  function updateLightDirection() {
    const lightDir = new THREE.Vector3(settings.lightDirectionX, settings.lightDirectionY, settings.lightDirectionZ);
    const lightDirMv = lightDir.applyMatrix4(camera.modelViewMatrix.invert().transpose());
    material.uniforms.lightDirection.value = lightDirMv;
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
  const cube = new THREE.Mesh(geometry, cubeMaterial);
  const crab = new THREE.Mesh(crabGeometry, crabMaterial);
  mesh = cube;
  material = cubeMaterial;
  crab.visible = false;

  gui.add(settings, 'objectToggle').onChange(val => {
    if (val) {
      material = crabMaterial;
      mesh = crab;
      crab.visible = true;
      cube.visible = false;
    }
    else {
      material = cubeMaterial;
      mesh = cube;
      crab.visible = false;
      cube.visible = true;
    }
  });

  const controls = new OrbitControls(camera, renderer.domElement)

  // Add cube to scene
  scene.add(cube);
  scene.add(crab);
  crab.scale.set(0.03, 0.03, 0.03);
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    material.uniforms.cameraPositionWorld.value = camera.position;
    updateLightDirection();
    // Rotate cube
    if (settings.rotate) {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    }


    // Render scene with camera
    renderer.render(scene, camera);
  };

  animate();
}

main();