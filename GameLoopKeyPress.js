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

// UI Messages
const collisionMessage = document.createElement("div");
collisionMessage.style.position = "fixed";
collisionMessage.style.top = "50%";
collisionMessage.style.left = "50%";
collisionMessage.style.transform = "translate(-50%, -50%)";
collisionMessage.style.fontFamily = "sans-serif";
collisionMessage.style.fontSize = "15vw";
collisionMessage.style.fontWeight = "bold";
collisionMessage.style.color = "#ff3333";
collisionMessage.style.textShadow = "2px 2px 4px #000000";
collisionMessage.style.display = "none";
collisionMessage.style.zIndex = "1";
document.body.appendChild(collisionMessage);

let score = 0;
let gameOver = false;
let lastSpawn = 0;
let spawnInterval = 1000; // Starting spawn time in milliseconds

const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "fixed";
scoreDisplay.style.top = "24px";
scoreDisplay.style.left = "24px";
scoreDisplay.style.fontFamily = "sans-serif";
scoreDisplay.style.fontSize = "24px";
scoreDisplay.style.fontWeight = "bold";
scoreDisplay.style.color = "#ffffff";
scoreDisplay.style.textShadow = "2px 2px 4px #000000";
scoreDisplay.style.zIndex = "1";
scoreDisplay.textContent = "Score: 0"; 
document.body.appendChild(scoreDisplay);

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

// Obstacles Array & Spawning
const obstacles = [];
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

function spawnObstacle() {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    
    // Randomize across both X and Z axes for full 3D space
    const randomX = (Math.random() - 0.5) * 20;
    const randomZ = (Math.random() - 0.5) * 20;
    obstacle.position.set(randomX, 10, randomZ);
    
    scene.add(obstacle);
    obstacles.push(obstacle);
}

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

// Movement Speed and Bounds
const speed = 0.1;
const playerBounds = new THREE.Box3();
const objectBounds = new THREE.Box3();

function handleCollisions() {
    if (gameOver) return;

    playerBounds.setFromObject(player);

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        objectBounds.setFromObject(obstacle);

        if (playerBounds.intersectsBox(objectBounds)) {
            gameOver = true;
            collisionMessage.textContent = "GAME OVER";
            collisionMessage.style.display = "block";
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        // Spawn Blocks Repeatedly and increase frequency
        const currentTime = performance.now();
        if(currentTime - lastSpawn > spawnInterval) {
            spawnObstacle();
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            lastSpawn = currentTime;
            
            // Decrease interval by 10ms to make it harder, bottoming out at 200ms
            if (spawnInterval > 50) {
                spawnInterval -= spawnInterval/10; //exponential increase
            }
        }

        // WASD Controls
        if (keys["w"]) player.position.z -= speed;
        if (keys["s"]) player.position.z += speed;
        if (keys["a"]) player.position.x -= speed;
        if (keys["d"]) player.position.x += speed;

        // Arrow Key Controls
        if (keys["arrowup"]) player.position.z -= speed;
        if (keys["arrowdown"]) player.position.z += speed;
        if (keys["arrowleft"]) player.position.x -= speed;
        if (keys["arrowright"]) player.position.x += speed;

        // Move and Remove Falling Blocks
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obstacle = obstacles[i];
            obstacle.position.y -= 0.05;

            if (obstacle.position.y < -2) {
                scene.remove(obstacle);
                obstacles.splice(i, 1);
            }
        }

        handleCollisions();
    }

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});