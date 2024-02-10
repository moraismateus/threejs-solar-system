// Import necessary modules and styles
import './style.css';
import * as THREE from '../threejs-solar-system/node_modules/three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Function to create celestial bodies: moon, earth, sun
function createCelestialBody(geometry, texturePath, MaterialClass, position = { x: 0, y: 0, z: 0 }) {
        const texture = new THREE.TextureLoader().load(texturePath);
        const material = new MaterialClass({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        scene.add(mesh);
        return mesh;
}


// Create celestial bodies by directly passing the material class
const moonMesh = createCelestialBody(new THREE.SphereGeometry(0.5, 100, 100), 'texture-moon.jpg', THREE.MeshLambertMaterial);
const earthMesh = createCelestialBody(new THREE.SphereGeometry(1.2, 100, 100), 'texture-earth-natural.jpg', THREE.MeshPhongMaterial);
const sunMesh = createCelestialBody(new THREE.SphereGeometry(5, 100, 100), 'texture-sun.jpg', THREE.MeshBasicMaterial);


// Setup lighting
const sunPointLight = new THREE.PointLight(0xffffff, 400);
sunPointLight.position.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(sunPointLight, ambientLight);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Function to add stars randomly
function addStar() {
        const geometry = new THREE.SphereGeometry(0.3, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(2000, 3000));
        star.position.set(x, y, z);
        scene.add(star);
}

// Populate the scene with stars
Array(4000).fill().forEach(addStar);

// Animation variables for earth and moon
let earthOrbitRadius = 14, earthOrbitSpeed = 0.003, orbitAngle = 0;
let moonOrbitRadius = 4, moonOrbitSpeed = 0.009, moonorbitAngle = 0;

// Animation loop to move earth and moon
function animate() {
        requestAnimationFrame(animate);
        orbitAngle += earthOrbitSpeed;
        moonorbitAngle += moonOrbitSpeed;

        // Earth's orbit
        earthMesh.position.x = Math.cos(orbitAngle) * earthOrbitRadius;
        earthMesh.position.z = Math.sin(orbitAngle) * earthOrbitRadius;
        earthMesh.rotation.y += 0.02;

        // Moon's orbit relative to earth
        moonMesh.position.x = earthMesh.position.x + Math.cos(moonorbitAngle) * moonOrbitRadius;
        moonMesh.position.z = earthMesh.position.z + Math.sin(moonorbitAngle) * moonOrbitRadius;
        moonMesh.rotation.y += 0.002;

        controls.update();
        renderer.render(scene, camera);
}

animate();