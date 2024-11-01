class Main {
    constructor() {
        this.pageViewsKey = 'pageViewsCount';
        this.initializeCounter();
        this.displayCount();
        this.setupSignInButton();
        this.setupLightningButton(); // Initialize the lightning effect button
    }

    // Add event listener for sign-in button when the window loads
   
    setupSignInButton() {
        const signInButton = document.querySelector(".InBtn");
        signInButton.addEventListener("click", window.signInUser);
    }
    

    initializeCounter() {
        if (!localStorage.getItem(this.pageViewsKey)) {
            localStorage.setItem(this.pageViewsKey, '0');
        }
    }

    incrementCount() {
        let currentCount = parseInt(localStorage.getItem(this.pageViewsKey));
        currentCount++;
        localStorage.setItem(this.pageViewsKey, currentCount.toString());
    }

    displayCount() {
        this.incrementCount();
        // Update count in div id count
        document.getElementById('count').innerHTML = 'You have visited this page ' + localStorage.getItem(this.pageViewsKey) + ' times.';
    }

    setupLightningButton() {
        const button = document.querySelector('.btn');
        button.addEventListener('click', () => this.createLightningEffect());
    }

    createLightningEffect() {
        const flashDuration = 30; // Duration for the screen to flash white
        const lightningDuration = 50; // Duration for the lightning to appear
        const disappearDuration = 20; // Duration before the lightning disappears
    
        // Get the position of the box element
        const box = document.querySelector('.box');
        const boxRect = box.getBoundingClientRect(); // Get the bounding rectangle of the box
    
        // Set the starting position of the lightning
        const startX = boxRect.left + boxRect.width / 2; // Center of the box
        const startY = boxRect.top; // Top of the box
    
        // Draw lightning with animation
        this.drawLightning(lightningDuration, startX, startY); // Pass the start positions
    
        // Flash the screen white after the lightning appears
        setTimeout(() => {
            this.flashScreen(flashDuration);
        }, lightningDuration);
    
        // Remove the lightning after the disappearance duration
        setTimeout(() => {
            lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height); // Clear the lightning canvas
        }, lightningDuration + flashDuration + disappearDuration);
    }

    drawLightning(duration, startX, startY) {
        lightningCtx.strokeStyle = "white"; // Color of the lightning
        lightningCtx.lineWidth = 3; // Width of the lightning lines
        lightningCtx.lineCap = "round";
    
        let startTime = performance.now(); // Get the current time
    
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const t = Math.min(elapsed / duration, 1); // Normalize time between 0 and 1
    
            lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height); // Clear the lightning canvas
    
            lightningCtx.beginPath();
            lightningCtx.moveTo(startX, startY);
    
            const steps = 10; // Number of zigzag steps
            const branchCount = Math.floor(Math.random() * 3) + 2; // Randomly choose 2 to 4 branches
            this.drawBranch(startX, startY, steps, branchCount);
    
            lightningCtx.stroke();
    
            if (t < 1) {
                requestAnimationFrame(animate); // Continue animating
            }
        };
    
        animate(); // Start the animation
    }
    
    drawBranch(x, y, steps, branches) {
        const branchAngle = Math.PI / 8; // Angle for branching
        const branchLength = lightningCanvas.height / (steps + 1); // Length of each step

        // Draw the main branch
        for (let i = 0; i < steps; i++) {
            const offsetX = (Math.random() - 0.5) * 100; // Random X offset
            y += branchLength; // Move down for the next step
            lightningCtx.lineTo(x + offsetX, y); // Draw the line

            // Branching logic
            if (i === Math.floor(steps / 2) && branches > 0) {
                const branchDirection = Math.random() < 0.5 ? 1 : -1; // Randomly choose direction
                const newX = x + offsetX + branchDirection * Math.cos(branchAngle) * 50;
                lightningCtx.lineTo(newX, y - branchLength / 2); // Create a branch

                this.drawBranch(newX, y, steps - i - 1, branches - 1); // Recursive call for further branches
                break; // Exit after branching
            }
        }
    }

    flashScreen(duration) {
        document.body.style.transition = `background-color ${duration}ms`;
        document.body.style.backgroundColor = "white";

        setTimeout(() => {
            document.body.style.backgroundColor = ""; // Reset to original color
        }, duration);
    }
}

// Note that we construct the class here, but we don't need to assign it to a variable.
document.mainClass = new Main();

const trailCanvas = document.getElementById('trailCanvas');
const trailCtx = trailCanvas.getContext('2d');

const lightningCanvas = document.getElementById('lightningCanvas');
const lightningCtx = lightningCanvas.getContext('2d');

// Resize canvas to fill the window
function resizeCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
    lightningCanvas.width = window.innerWidth; // Resize lightning canvas too
    lightningCanvas.height = window.innerHeight; // Resize lightning canvas too
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mousePositions = [];
let lastMouseMoveTime = Date.now(); // Track the last mouse move time

// Listen for mouse movement and store positions
document.addEventListener('mousemove', (e) => {
    // Update last mouse move time
    lastMouseMoveTime = Date.now();

    // Add the current mouse position to the array
    mousePositions.push({ x: e.pageX, y: e.pageY });

    // Limit the number of points stored to prevent excessive memory use
    if (mousePositions.length > 25) {
        mousePositions.shift();  // Remove the oldest points
    }
});

// Draw the trail
function drawTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height); // Clear canvas on each frame

    // Draw lines between the stored mouse positions
    for (let i = 1; i < mousePositions.length; i++) {
        // Calculate the color based on the position index
        const t = i / mousePositions.length; // Normalize index to range [0, 1]
        const r = Math.round(173 + (0 - 173) * t); // 173 (light blue) to 0 (blue)
        const g = Math.round(216 + (0 - 216) * t); // 216 (light blue) to 0 (blue)
        const b = Math.round(230 + (0 + 25) * t); // 230 (light blue) to 255 (blue)

        trailCtx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        trailCtx.lineWidth = 5;
        trailCtx.lineCap = 'round';

        trailCtx.beginPath();
        trailCtx.moveTo(mousePositions[i - 1].x, mousePositions[i - 1].y);
        trailCtx.lineTo(mousePositions[i].x, mousePositions[i].y);
        trailCtx.stroke();
    }

    // Check if the mouse has stopped moving for more than 100 milliseconds
    if (Date.now() - lastMouseMoveTime > 50) {
        // Remove the oldest position if there are positions to remove
        if (mousePositions.length > 0) {
            mousePositions.shift(); // Remove the oldest point to create a fading effect
        }
    }

    // Continuously call the drawTrail function to update the canvas
    requestAnimationFrame(drawTrail);
}

// Start the drawing loop
drawTrail();

const starCanvas = document.getElementById('starCanvas');
const starCtx = starCanvas.getContext('2d');

starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

// Function to resize the canvas
function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStarCanvas);

const stars = [];
const starCount = 100; // Number of stars

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.2 // Speed of the stars
        });
    }
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (let star of stars) {
        starCtx.fillStyle = 'white';
        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        starCtx.fill();
    }
}

function updateStars() {
    for (let star of stars) {
        star.x += star.speed; // Move stars horizontally
        if (star.x > starCanvas.width) {
            star.x = 0; // Reset to the left side
            star.y = Math.random() * starCanvas.height; // Randomize vertical position
        }
    }
}

function animateStars() {
    drawStars();
    updateStars();
    requestAnimationFrame(animateStars);
}

createStars();
animateStars();