import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const container = document.getElementById('globeContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0); 


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshPhongMaterial({
  color: 0x87CEEB,
  transparent: true,
  opacity: 0.3
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

const continentLoader = new THREE.TextureLoader();
continentLoader.load('https://ibb.co/5xSDfSt', (texture) => {
  const continentMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8
  });
  const continentSphere = new THREE.Mesh(new THREE.SphereGeometry(5.05, 64, 64), continentMaterial);
  scene.add(continentSphere);
});


const numberOfTechStacks = 20; 


const languageTextures = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  // Add more icons for additional languages
  // Ensure you have enough textures for each language
];

// Generate positions for specified number of programming languages
function generatePositions(numPositions, radius) {
  const positions = [];
  for (let i = 0; i < numPositions; i++) {
    const phi = Math.acos(-1 + (2 * i) / numPositions);
    const theta = Math.sqrt(numPositions * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    positions.push([x, y, z]);
  }
  return positions;
}

const actualTechStacks = Math.min(numberOfTechStacks, languageTextures.length);

const positions = generatePositions(actualTechStacks, 3); 

const techStacks = [];
for (let i = 0; i < actualTechStacks; i++) {
  const tech = {
    position: positions[i],
    texture: languageTextures[i % languageTextures.length], 
    name: `Language ${i + 1}` 
  };
  techStacks.push(tech);
}

const loader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const sprites = [];

techStacks.forEach(tech => {
    const spriteMaterial = new THREE.SpriteMaterial({ map: loader.load(tech.texture) });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(...tech.position);
    sprite.scale.set(1, 1, 1);
    sprite.userData.name = tech.name;
    scene.add(sprite);
    sprites.push(sprite);
  });
    
camera.position.z = 3;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Make it responsive
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Tooltip and click functionality
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('click', onMouseClick);

function onMouseMove(event) {
  mouse.x = (event.clientX - container.offsetLeft) / container.clientWidth * 2 - 1;
  mouse.y = - ((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(sprites);

  if (intersects.length > 0) {
    const intersection = intersects[0];
    tooltipDiv.textContent = intersection.object.userData.name;
    tooltipDiv.style.left = (event.clientX + 10) + 'px';
    tooltipDiv.style.top = (event.clientY + 10) + 'px';
    tooltipDiv.style.display = 'block';
  } else {
    tooltipDiv.style.display = 'none';
  }
}

function onMouseClick(event) {
  mouse.x = (event.clientX - container.offsetLeft) / container.clientWidth * 2 - 1;
  mouse.y = - ((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(sprites);

  if (intersects.length > 0) {
    const target = intersects[0].object.position.clone();
    const distance = camera.position.distanceTo(target);
    const newPosition = target.normalize().multiplyScalar(distance);
    
    gsap.to(camera.position, {
      duration: 1,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      onUpdate: function() {
        camera.lookAt(target);
      }
    });
  }
}
