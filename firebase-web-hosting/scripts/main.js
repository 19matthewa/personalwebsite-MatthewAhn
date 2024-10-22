// class Main {
//     constructor() {
//         this.pageViewsKey = 'pageViewsCount';
//         this.initializeCounter();
//         this.displayCount();
//         this.setupLightningButton(); // Initialize the lightning effect button
//     }

//     initializeCounter() {
//         if (!localStorage.getItem(this.pageViewsKey)) {
//             localStorage.setItem(this.pageViewsKey, '0');
//         }
//     }

//     incrementCount() {
//         let currentCount = parseInt(localStorage.getItem(this.pageViewsKey));
//         currentCount++;
//         localStorage.setItem(this.pageViewsKey, currentCount.toString());
//     }

//     displayCount() {
//         this.incrementCount();
//         // Update count in div id count
//         document.getElementById('count').innerHTML = 'You have visited this page ' + localStorage.getItem(this.pageViewsKey) + ' times.';
//     }

//     setupLightningButton() {
//         const button = document.querySelector('.btn');
//         button.addEventListener('click', () => this.createLightningEffect());
//     }

//     createLightningEffect() {
//         const flashDuration = 15; // Duration for the screen to flash white
//         const lightningDuration = 25; // Duration for the lightning to appear
//         const disappearDuration = 35; // Duration before the lightning disappears

//         // Draw lightning with animation
//         this.drawLightning(lightningDuration);

//         // Flash the screen white after the lightning appears
//         setTimeout(() => {
//             this.flashScreen(flashDuration);
//         }, lightningDuration);

//         // Remove the lightning after the disappearance duration
//         setTimeout(() => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//         }, lightningDuration + flashDuration + disappearDuration);
//     }

//     drawLightning(duration) {
//         const startX = Math.random() * canvas.width; // Random start point at the top
//         const startY = 0; // Start from the top of the canvas

//         ctx.strokeStyle = "white"; // Color of the lightning
//         ctx.lineWidth = 3; // Width of the lightning lines
//         ctx.lineCap = "round";

//         let startTime = performance.now(); // Get the current time

//         const animate = () => {
//             const elapsed = performance.now() - startTime;
//             const t = Math.min(elapsed / duration, 1); // Normalize time between 0 and 1

//             ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

//             ctx.beginPath();
//             ctx.moveTo(startX, startY);

//             const steps = 10; // Number of zigzag steps
//             const branchCount = Math.floor(Math.random() * 3) + 2; // Randomly choose 2 to 4 branches
//             this.drawBranch(startX, startY, steps, branchCount);

//             ctx.stroke();

//             if (t < 1) {
//                 requestAnimationFrame(animate); // Continue animating
//             }
//         };

//         animate(); // Start the animation
//     }

//     drawBranch(x, y, steps, branches) {
//         const branchAngle = Math.PI / 8; // Angle for branching
//         const branchLength = canvas.height / (steps + 1); // Length of each step

//         // Draw the main branch
//         for (let i = 0; i < steps; i++) {
//             const offsetX = (Math.random() - 0.5) * 100; // Random X offset
//             y += branchLength; // Move down for the next step
//             ctx.lineTo(x + offsetX, y); // Draw the line

//             // Branching logic
//             if (i === Math.floor(steps / 2) && branches > 0) {
//                 const branchDirection = Math.random() < 0.5 ? 1 : -1; // Randomly choose direction
//                 const newX = x + offsetX + branchDirection * Math.cos(branchAngle) * 50;
//                 ctx.lineTo(newX, y - branchLength / 2); // Create a branch

//                 this.drawBranch(newX, y, steps - i - 1, branches - 1); // Recursive call for further branches
//                 break; // Exit after branching
//             }
//         }
//     }

//     flashScreen(duration) {
//         document.body.style.transition = `background-color ${duration}ms`;
//         document.body.style.backgroundColor = "white";

//         setTimeout(() => {
//             document.body.style.backgroundColor = ""; // Reset to original color
//         }, duration);
//     }
// }

// // Note that we construct the class here, but we don't need to assign it to a variable.
// document.mainClass = new Main();

// const canvas = document.getElementById('trailCanvas');
// const ctx = canvas.getContext('2d');

// // Resize canvas to fill the window
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// });

// let mousePositions = [];
// let lastMouseMoveTime = Date.now(); // Track the last mouse move time

// // Listen for mouse movement and store positions
// document.addEventListener('mousemove', (e) => {
//     // Update last mouse move time
//     lastMouseMoveTime = Date.now();

//     // Add the current mouse position to the array
//     mousePositions.push({ x: e.pageX, y: e.pageY });

//     // Limit the number of points stored to prevent excessive memory use
//     if (mousePositions.length > 25) {
//         mousePositions.shift();  // Remove the oldest points
//     }
// });

// // Draw the trail
// function drawTrail() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on each frame

//     // Draw lines between the stored mouse positions
//     for (let i = 1; i < mousePositions.length; i++) {
//         // Calculate the color based on the position index
//         const t = i / mousePositions.length; // Normalize index to range [0, 1]
//         const r = Math.round(173 + (0 - 173) * t); // 173 (light blue) to 0 (blue)
//         const g = Math.round(216 + (0 - 216) * t); // 216 (light blue) to 0 (blue)
//         const b = Math.round(230 + (0 + 25) * t); // 230 (light blue) to 255 (blue)

//         ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
//         ctx.lineWidth = 5;
//         ctx.lineCap = 'round';

//         ctx.beginPath();
//         ctx.moveTo(mousePositions[i - 1].x, mousePositions[i - 1].y);
//         ctx.lineTo(mousePositions[i].x, mousePositions[i].y);
//         ctx.stroke();
//     }

//     // Check if the mouse has stopped moving for more than 100 milliseconds
//     if (Date.now() - lastMouseMoveTime > 50) {
//         // Remove the oldest position if there are positions to remove
//         if (mousePositions.length > 0) {
//             mousePositions.shift(); // Remove the oldest point to create a fading effect
//         }
//     }

//     // Continuously call the drawTrail function to update the canvas
//     requestAnimationFrame(drawTrail);
// }

// // Start the drawing loop
// drawTrail();
class Main {
    constructor() {
        this.pageViewsKey = 'pageViewsCount';
        this.initializeCounter();
        this.displayCount();
        this.setupLightningButton(); // Initialize the lightning effect button
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
        const flashDuration = 50; // Duration for the screen to flash white
        const lightningDuration = 70; // Duration for the lightning to appear
        const disappearDuration = 30; // Duration before the lightning disappears

        // Draw lightning with animation
        this.drawLightning(lightningDuration);

        // Flash the screen white after the lightning appears
        setTimeout(() => {
            this.flashScreen(flashDuration);
        }, lightningDuration);

        // Remove the lightning after the disappearance duration
        setTimeout(() => {
            lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height); // Clear the lightning canvas
        }, lightningDuration + flashDuration + disappearDuration);
    }

    drawLightning(duration) {
        const startX = Math.random() * lightningCanvas.width; // Random start point at the top
        const startY = 0; // Start from the top of the canvas

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

