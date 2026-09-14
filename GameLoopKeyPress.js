import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x44aa44
});

const plane = new THREE.Mesh(
    planeGeometry,
    planeMaterial
);

plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Lights
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    1
);

directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Player Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff
});

const player = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);

player.position.y = 0.5;
scene.add(player);

// Keyboard State Object
const keys = {};

// Key Down
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

// Key Up
window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Movement Speed
const speed = 0.1;

// Animation Loop
function animate() {

    requestAnimationFrame(animate);

    // WASD Controls
    if (keys["w"]) {
        player.position.z -= speed;
    }

    if (keys["s"]) {
        player.position.z += speed;
    }

    if (keys["a"]) {
        player.position.x -= speed;
    }

    if (keys["d"]) {
        player.position.x += speed;
    }

    // Arrow Key Controls
    if (keys["arrowup"]) {
        player.position.z -= speed;
    }

    if (keys["arrowdown"]) {
        player.position.z += speed;
    }

    if (keys["arrowleft"]) {
        player.position.x -= speed;
    }

    if (keys["arrowright"]) {
        player.position.x += speed;
    }

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});