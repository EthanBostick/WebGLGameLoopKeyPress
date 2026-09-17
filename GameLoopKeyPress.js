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

const collisionMessage = document.createElement("div");
collisionMessage.textContent = "Collision is happening!";
collisionMessage.style.position = "fixed";
collisionMessage.style.top = "24px";
collisionMessage.style.left = "50%";
collisionMessage.style.transform = "translateX(-50%)";
collisionMessage.style.fontFamily = "sans-serif";
collisionMessage.style.fontSize = "28px";
collisionMessage.style.fontWeight = "bold";
collisionMessage.style.color = "#ffffff";
collisionMessage.style.textShadow = "2px 2px 4px #000000";
collisionMessage.style.display = "none";
collisionMessage.style.zIndex = "1";
document.body.appendChild(collisionMessage);

const timerMessage = document.createElement("div");
timerMessage.style.position = "fixed";
timerMessage.style.top = "24px";
timerMessage.style.right = "24px";
timerMessage.style.fontFamily = "sans-serif";
timerMessage.style.fontSize = "24px";
timerMessage.style.fontWeight = "bold";
timerMessage.style.color = "#ffffff";
timerMessage.style.textShadow = "2px 2px 4px #000000";
timerMessage.style.zIndex = "1";
document.body.appendChild(timerMessage);

let score = 0;
let gameWon = false;

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
scoreDisplay.textContent = "Score: 0 / 10"; 
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

const collectibles = [];
const collectibleGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const collectibleMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333 });

for(let i = 0; i < 10; i++) {
    const cube = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
    
    cube.position.x = (Math.random() - 0.5) * 25;
    cube.position.y = 0.5; // Keeps it on top of the plane
    cube.position.z = (Math.random() - 0.5) * 25;
    
    scene.add(cube);
    collectibles.push(cube);
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

// Movement Speed
const speed = 0.1;
const playerBounds = new THREE.Box3();
const objectBounds = new THREE.Box3();
let collisionTime = 0;
let targetFound = false;
const gameStartTime = performance.now();
const gameDuration = 20;

function updateTimerMessage(secondsRemaining) {
    if (secondsRemaining === 0) {
	timerMessage.textContent = "TIME'S UP!";
	timerMessage.style.top = "50%";
	timerMessage.style.right = "auto";
	timerMessage.style.left = "50%";
	timerMessage.style.transform = "translate(-50%, -50%)";
	timerMessage.style.width = "100%";
	timerMessage.style.textAlign = "center";
	timerMessage.style.fontSize = "15vw";
	timerMessage.style.color = "#ff3333";
    } else {
	timerMessage.textContent = `Time: ${secondsRemaining}`;
    }
}

function updateTimer() {
    const elapsedSeconds = Math.floor((performance.now() - gameStartTime) / 1000);
    const secondsRemaining = Math.max(gameDuration - elapsedSeconds, 0);
    updateTimerMessage(secondsRemaining);
}

function updateCollisionMessage(isColliding) {
    if (targetFound) {
	collisionMessage.textContent = "Congratulations! You win!";
	collisionMessage.style.display = "block";
	collisionMessage.style.color = "#22cc55";
    } else if (isColliding) {
	collisionMessage.textContent = "Collision is happening!";
	collisionTime += 0.05;
	collisionMessage.style.display = "block";
	collisionMessage.style.color = `hsl(${(collisionTime * 180) % 360}, 100%, 50%)`;
    } else {
	collisionTime = 0;
	collisionMessage.textContent = "Collision is happening!";
	collisionMessage.style.display = "none";
	collisionMessage.style.color = "#ffffff";
    }
}

function handleCollisions() {
    if (gameWon) return;

    playerBounds.setFromObject(player);

    for (let i = collectibles.length - 1; i >= 0; i--) {
	const cube = collectibles[i];
	objectBounds.setFromObject(cube);

	if (playerBounds.intersectsBox(objectBounds)) {
	    scene.remove(cube);
	    collectibles.splice(i, 1);
	    score++;
	    
	    scoreDisplay.textContent = `Score: ${score} / 10`;

	    if (collectibles.length === 0) {
		gameWon = true;
		collisionMessage.textContent = "You Win!";
		collisionMessage.style.display = "block";
		collisionMessage.style.color = "#22cc55";
	    }
	}
    }
}

// Animation Loop
function animate() {

    requestAnimationFrame(animate);

    collectibles.forEach(cube => {
	cube.rotation.y += 0.02;
	cube.rotation.x += 0.01;
    });

    if (!gameWon) {
    	    updateTimer();
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
    }

    handleCollisions();

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
