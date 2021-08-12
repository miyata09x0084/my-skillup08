import * as THREE from 'three';

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass.js';
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js';

let scene, camera, renderer;
let cloudGeo, cloudMaterial, cloudParticles = [];

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  let ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);

  let directionalLight = new THREE.DirectionalLight("#ffff31");
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  let orangeLight = new THREE.PointLight("#ffff7d", 50, 450, 1.9);
  orangeLight.position.set(200, 300, 100);
  scene.add(orangeLight);
  let redLight = new THREE.PointLight("#ff9831", 50, 450, 1.9);
  redLight.position.set(100, 300, 100);
  scene.add(redLight);
  let blueLight = new THREE.PointLight("#98ff31", 50, 450, 1.9);
  blueLight.position.set(300, 300, 200);
  scene.add(blueLight);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.fog = new THREE.FogExp2("#0a0f35", 0.00001);
  renderer.setClearColor(scene.fog.color);
  document.body.appendChild(renderer.domElement);

  let loader = new THREE.TextureLoader();
  loader.load('image/circle.png', function(texture){
    cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    cloudMaterial = new THREE.MeshLambertMaterial({
      map:texture,
      transparent: true
    });

    for(let p=0; p<20; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(
        Math.random()*800-400,
        450,
        Math.random()*500-500
      );

      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random()*2*Math.PI;
      cloud.material.opacity = 0.55;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
  );
  composer.addPass(bloomPass);
  const filmPass = new FilmPass(
    0.35,   // noise intensity
    0.025,  // scanline intensity
    648,    // scanline count
    false,  // grayscale
  );
  filmPass.renderToScreen = true;
  composer.addPass(filmPass);

  render();
}

function render() {
  cloudParticles.forEach(p => {
    p.rotation.z -= 0.001;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
init();