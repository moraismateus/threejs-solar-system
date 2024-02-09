import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);


renderer.render(scene, camera);

const moonGeometry = new THREE.SphereGeometry(0.5, 100,100);
const moonTexture = new THREE.TextureLoader().load('texture-moon.jpg');
const moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);


scene.add(moonMesh);

const earthGeometry = new THREE.SphereGeometry(1.2, 100, 100);
const earthTexture = new THREE.TextureLoader().load('texture-earth-natural.jpg');
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);


scene.add(earthMesh);

const sunGeometry = new THREE.SphereGeometry(5, 100, 100);
const sunTexture = new THREE.TextureLoader().load('texture-sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

scene.add(sunMesh);


const sunPointLight = new THREE.PointLight(0xffffff, 400);
sunPointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.025);
scene.add(sunPointLight, ambientLight);


const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
        const geometry = new THREE.SphereGeometry(0.3, 24, 24);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        const star = new THREE.Mesh(geometry, material);

        const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(2000, 3000));
        star.position.set(x,y,z);

        scene.add(star);
}

Array(4000).fill().forEach(addStar);


sunMesh.position.set(0, 0, 0);

// Initial position of the earth
let earthOrbitRadius = 14; // The distance from the sun
let earthOrbitSpeed = 0.003; // The speed of the orbit
let orbitAngle = 0; // Initial angle

let moonOrbitRadius = 4; // The distance from earth
let moonOrbitSpeed = 0.009; // The speed of the orbit
let moonorbitAngle = 0; // Initial angle

function animate() {
        requestAnimationFrame(animate);


        // Calculate the new position
        orbitAngle += earthOrbitSpeed;
        earthMesh.position.x = sunMesh.position.x + earthOrbitRadius * Math.cos(orbitAngle);
        earthMesh.position.z = sunMesh.position.z + earthOrbitRadius * Math.sin(orbitAngle);
        earthMesh.rotation.y += 0.02 ;

        // Calculate the new position
        moonorbitAngle += moonOrbitSpeed;
        moonMesh.position.x = earthMesh.position.x + moonOrbitRadius * Math.cos(moonorbitAngle);
        moonMesh.position.z = earthMesh.position.z + moonOrbitRadius * Math.sin(moonorbitAngle);
        moonMesh.rotation.y += 0.002;

        controls.update();

        renderer.render(scene, camera);
}

animate()