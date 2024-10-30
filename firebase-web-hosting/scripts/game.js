const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
// Game state flags
let levelComplete = false;
let gameOver = false;

// Function to display the "GAME OVER" screen
function displayGameOver() {
    // Clear the canvas with a black background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = "GAME OVER!";
    const fontSize = 80;
    const letterSpacing = fontSize * 1.2; // Increased spacing between letters
    ctx.textAlign = "center";
    ctx.font = `bold ${fontSize}px Arial`;

    // Calculate total width for centering
    const totalWidth = letterSpacing * (text.length - 1);
    const startX = (canvas.width - totalWidth) / 2;
    const y = canvas.height / 2;

    // 3D effect layers
    const layers = 12;
    
    for (let i = 0; i < text.length; i++) {
        const x = startX + (i * letterSpacing);
        
        // Draw 3D shadow layers
        for (let layer = layers; layer > 0; layer--) {
            const offset = layer * 1.5;
            ctx.fillStyle = `rgba(0, 0, 0, ${0.7 - layer/layers})`;
            ctx.fillText(text[i], x, y + offset);
        }

        // Main text with gradient
        const gradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
        gradient.addColorStop(0, '#ff3366');
        gradient.addColorStop(0.5, '#ff1a1a');
        gradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = gradient;
        ctx.fillText(text[i], x, y);

        // Add highlight effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillText(text[i], x, y - 2);
    }

    // Add overall text shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    // Reset shadow effect
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}
// Function to display the "LEVEL COMPLETE" screen

function displayLevelComplete() {
    // Clear the canvas with a white background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = "LEVEL COMPLETE";
    const fontSize = 80;
    const letterSpacing = fontSize * 0.8;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    
    // Calculate total width of text with spacing
    const totalWidth = letterSpacing * (text.length - 1);
    const startX = (canvas.width - totalWidth) / 2;
    const y = canvas.height / 2;

    // Calculate the total number of color steps needed
    const totalSteps = text.length * 3; // Multiply by 3 for smoother transition

    for (let i = 0; i < text.length; i++) {
        const x = startX + (i * letterSpacing);
        
        // Create smoother rainbow transition
        // Map the letter position to a color wheel position
        // Multiply by 3 to make colors flow across multiple letters
        const hue = ((i * 3) / totalSteps) * 360;
        
        // Add shadow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Create gradient for each letter
        const gradient = ctx.createLinearGradient(x - fontSize/4, y - fontSize/2, x + fontSize/4, y + fontSize/2);
        
        // Calculate gradient colors that flow into next letter
        const currentHue = (hue) % 360;
        const nextHue = (hue + 30) % 360; // Blend into next color
        
        gradient.addColorStop(0, `hsl(${currentHue}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${nextHue}, 100%, 50%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillText(text[i], x, y);
    }
    
    // Reset shadow effect
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}



// Player character
function initializePlayer() {
    player = {
        x: 50,
        y: 550,
        width: 50,
        height: 50,
        speed: 5,
        velocityY: 0,
        jumpPower: -15,
        gravity: 0.5,
        grounded: false,
        state: 'small',
        health: 3,
        coins: 0,
        fireFlower: false,
        lastDirection: 1,
        invincible: false,
        invincibilityTimer: 0,
        invincibilityDuration: 1000
    };
}
initializePlayer();
// Terrain and obstacles
const groundHeight = 20;
const terrain = [];
const pipes = [];
const platforms = [];
const coins = [];
const questionBlocks = [];
const items = []; // Array to hold items like power-ups

// Enemies
const enemies = [];


let scale = Math.min(width / 800, height / 600); // Adjust the scaling for 800x600 base
canvas.style.transform = `scale(${scale})`;       // Apply scale transformation
canvas.style.transformOrigin = 'top left';

// Function to generate terrain
function generateTerrain(startX = 0, length = 800, amplitude = 50, frequency = 0.05, isCurved = true) {
    terrain.length = 0; // Clear previous terrain

    for (let x = startX; x < startX + length; x += 40) {
        let y;

        if (isCurved) {
            // Generate a sine wave curve for the terrain
            y = height - groundHeight - (Math.sin(x * frequency) * amplitude);
        } else {
            // Generate straight terrain at a fixed height (can be adjusted)
            y = height - groundHeight - amplitude; // Flat terrain at height defined by amplitude
        }

        terrain.push({ x: x, y: y, width: 40, height: groundHeight });
    }
}


// Create pipes with specified x and y coordinates
function createPipes(startX = 0, startY = height - 120) {
    pipes.push({ x: startX, y: startY, width: 40, height: 100 }); // Vertical pipe
}

// Create floating platforms with specified x and y coordinates
function createPlatforms(startX = 0, startY = height - 200) {
    platforms.push({ x: startX, y: startY, width: 100, height: 20 });
}

// Create coins with specified x and y coordinates
function createCoins(startX = 0, startY = height - 100) {
    coins.push({ x: startX, y: startY, width: 20, height: 20 });

}

// Create question block with specified x and y coordinates
function createQuestionBlocks(startX = 0, startY = height - 250) {
    questionBlocks.push({ x: startX , y: startY, width: 40, height: 40, hasPowerUp: true });
}

// Create enemies with specified coordinates and type
function createEnemies(startX = 0, startY = height - 60, type = 'Goomba') {
    if (type === 'Goomba') {
        enemies.push(new Goomba(startX, startY));
    } else if (type === 'KoopaTroopa') {
        enemies.push(new KoopaTroopa(startX, startY));
    }
}


// Item class
class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // 'mushroom' or 'fireFlower'
        this.velocityY = -2; // Initial upward velocity
    }

    update() {
        this.y += this.velocityY; // Move the item up
        this.velocityY += 0.1; // Gravity effect on the item
    }

    render() {
        ctx.fillStyle = this.type === 'mushroom' ? 'red' : 'orange'; // Color based on type
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collect(player) {
        if (this.type === 'mushroom') {
            player.state = 'big'; // Change player state to big
        } else if (this.type === 'fireFlower') {
            player.fireFlower = true; // Grant fire flower ability
        player.canShoot = true; // Allow shooting fireballs
        }
    }
}

let flagpole = {
    x: width - 50, // Position flagpole near the end of the level
    y: height-500, // 150px tall flagpole
    width: 10,
    height: 500,
    touched: false,
};

// Fireball class
class Fireball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.speed = 5; // Slower fireball speed
        this.direction = direction; // 1 for right, -1 for left
    }

    update() {
        this.x += this.speed * this.direction; // Move fireball in the direction of last player movement
    }

    render() {
        ctx.fillStyle = 'orange'; // Fireball color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}


// Goomba class
class Goomba {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 2;
        this.direction = 1; // 1 for right, -1 for left
        this.grounded = true;
    }

    update() {
        // Move back and forth
        this.x += this.speed * this.direction;

        // Change direction if hitting a wall
        if (this.x <= 0 || this.x + this.width >= width) {
            this.direction *= -1;
        }

        // Check collision with player
        if (this.collidesWith(player)) {
            if (!player.grounded) { // If player jumps on Goomba
                enemies.splice(enemies.indexOf(this), 1); // Remove Goomba
            } else if (!player.invincible){
                if(player.state == 'big'){
                player.invincible = true; // Set invincible flag
                player.invincibilityTimer = player.invincibilityDuration; 
                player.state = 'small'
                }else{
                player.health -= 1; // Deal damage to player
                player.invincible = true; // Set invincible flag
                player.invincibilityTimer = player.invincibilityDuration; 
                player.x = 50;
                player.y = 550;
            }}
        }
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    render() {
        ctx.fillStyle = 'brown'; // Goomba color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Koopa Troopa class
class KoopaTroopa {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 2; // Normal walking speed (same as Goomba)
        this.shellSpeed = 4; // Faster speed when in moving shell form
        this.direction = 1;
        this.grounded = true;
        this.state = 'normal'; // 'normal', 'shell', 'stoppedShell'
        this.stateTimer = 0;
        this.stateDuration = 8000; // 10 seconds in shell state
        this.stateTransitionDelay = 500; // 500ms transition delay
        this.lastStateChange = 0; // Track when the last state change occurred
    }

    update() {
        const currentTime = Date.now();
        const timeSinceStateChange = currentTime - this.lastStateChange;
        
        // Update position based on current state
        switch (this.state) {
            case 'normal':
                this.x += this.speed * this.direction;
                if (this.x <= 0 || this.x + this.width >= width) {
                    this.direction *= -1;
                }
                break;

            case 'shell':
                this.x += this.shellSpeed * this.direction;
                if (this.x <= 0 || this.x + this.width >= width) {
                    this.direction *= -1;
                }
                break;

            case 'stoppedShell':
                if (currentTime - this.stateTimer > this.stateDuration) {
                    this.changeState('normal');
                }
                break;
        }

        // Check collision with player only if we're not in transition period
        if (timeSinceStateChange > this.stateTransitionDelay && this.collidesWith(player)) {
            if (!player.grounded) {
                // Player hit Koopa from above
                player.velocityY = -8; // Small bounce
                
                switch (this.state) {
                    case 'normal':
                        this.changeState('shell');
                        this.direction = player.x < this.x ? 1 : -1;
                        break;
                    case 'shell':
                        this.changeState('stoppedShell');
                        break;
                    case 'stoppedShell':
                        this.changeState('shell');
                        this.direction = player.x < this.x ? 1 : -1;
                        break;
                }
            } else if (this.state !== 'stoppedShell' && !player.invincible) {
                // Player touched dangerous state Koopa
                if (player.state === 'big') {
                    player.state = 'small';
                    player.invincible = true;
                    player.invincibilityTimer = player.invincibilityDuration;
                } else {
                    player.health -= 1;
                    player.invincible = true;
                    player.invincibilityTimer = player.invincibilityDuration;
                    player.x = 50;
                    player.y = 550;
                }
            }
        }

        // Check for collision with Goomba only when in moving shell state
        if (this.state === 'shell' && timeSinceStateChange > this.stateTransitionDelay) {
            enemies.forEach(enemy => {
                if (enemy instanceof Goomba && this.collidesWith(enemy)) {
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
            });
        }
    }

    changeState(newState) {
        this.state = newState;
        this.lastStateChange = Date.now();
        if (newState === 'stoppedShell') {
            this.stateTimer = Date.now();
        }
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    render() {
        const timeSinceStateChange = Date.now() - this.lastStateChange;
        
        // Flashing effect during transition
        if (timeSinceStateChange < this.stateTransitionDelay && Math.floor(timeSinceStateChange / 100) % 2 === 0) {
            ctx.fillStyle = 'white'; // Flash white during transition
        } else {
            // Normal colors based on state
            switch (this.state) {
                case 'normal':
                    ctx.fillStyle = 'red';
                    break;
                case 'shell':
                    ctx.fillStyle = 'green';
                    break;
                case 'stoppedShell':
                    ctx.fillStyle = 'gray';
                    break;
            }
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


    // Clear all game elements
    terrain.length = 0;
    pipes.length = 0;
    platforms.length = 0;
    coins.length = 0;
    questionBlocks.length = 0;
    enemies.length = 0;
    
    // Reset player
    initializePlayer();
    
    // Reset flags
    levelComplete = false;
    gameOver = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


function setupLevel0() {
    // First, create the base terrain with rolling hills
    generateTerrain(0, 3200, 60, 0.02, true); // Make it wider to match the shown level
    
    // Add pipes at strategic locations
    createPipes(400, height - 120);  // First pipe
    createPipes(600, height - 160);  // Taller pipe
    createPipes(2800, height - 120); // Pipe near end
    
    // Create platforms for jumping sections
    createPlatforms(800, height - 200);
    createPlatforms(1000, height - 180);
    createPlatforms(1200, height - 160);
    
    // Add coins in patterns
    // First coin section
    for (let i = 0; i < 5; i++) {
        createCoins(500 + (i * 30), height - 250);
    }
    // Second coin section
    for (let i = 0; i < 3; i++) {
        createCoins(1000 + (i * 30), height - 300);
    }
    
    // Add question blocks
    createQuestionBlocks(300, height - 250);
    createQuestionBlocks(900, height - 250);
    createQuestionBlocks(1500, height - 250);
    
    // Add enemies
    createEnemies(500, height - 60, 'Goomba');
    createEnemies(800, height - 60, 'KoopaTroopa');
    createEnemies(1200, height - 60, 'Goomba');
    
    // Create underground sections (assuming we have a method for this)
    // You might need to add additional methods to create the underground rooms
    // shown in the image with their specific block patterns
    
    // Add floating platforms in ascending pattern
    for (let i = 0; i < 4; i++) {
        createPlatforms(1600 + (i * 150), height - (200 + i * 40));
    }
}

function setupLevel1() { 
    // Create flat terrain for underground base
    generateTerrain(0, 3200, 0, 0, false); // Use flat terrain for underground
    
    // Set up main tunnel structure with platforms
    // Left side entrance area
    createPlatforms(0, height - 200, 200, 20);
    
    // Create vertical pipes for transportation
    createPipes(200, height - 300); // Entrance pipe
    createPipes(800, height - 400); // Middle section pipe
    createPipes(1600, height - 350); // Exit area pipe
    createPipes(2400, height - 300); // Final pipe
    
    // Create horizontal pipes for obstacles
    createPipes(400, height - 150);
    createPipes(1000, height - 200);
    createPipes(1800, height - 180);
    
    // Add platforms for traversal
    // First section platforms
    createPlatforms(300, height - 250);
    createPlatforms(500, height - 300);
    createPlatforms(700, height - 350);
    createPlatforms(500, height - 150);

    
    // Middle section platforms
    for (let i = 0; i < 3; i++) {
        createPlatforms(1000 + (i * 200), height - 280);
    }
    
    // Create coin patterns
    // Coin trail leading up
    for (let i = 0; i < 5; i++) {
        createCoins(600 + (i * 30), height - (200 + i * 30));
    }
    
    // Coin clusters in open areas
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            createCoins(1200 + (i * 30), height - (250 + j * 30));
        }
    }
    
    // Add question blocks in key locations
    createQuestionBlocks(450, height - 350);
    createQuestionBlocks(1100, height - 300);
    createQuestionBlocks(1900, height - 280);
    
    // Add enemies in strategic locations
    createEnemies(600, height - 60, 'Goomba');
    createEnemies(1200, height - 60, 'KoopaTroopa');
    createEnemies(1800, height - 60, 'Goomba');
    
    // Create platform maze section
    // This creates a more complex jumping puzzle area
    let mazeStartX = 2000;
    let platformHeights = [150, 200, 250, 300, 250, 200];
    for (let i = 0; i < platformHeights.length; i++) {
        createPlatforms(
            mazeStartX + (i * 120), 
            height - platformHeights[i],
            80, // shorter platforms for tighter jumping
            20
        );
    }
    
    // Add hidden bonus areas
    // Secret upper path
    createPlatforms(1500, height - 400, 300, 20);
    for (let i = 0; i < 5; i++) {
        createCoins(1550 + (i * 30), height - 450);
    }
}

// setupLevel0();
setupLevel1()


let keys = {
    left: false,
    right: false,
    jump: false,
};

// Input handling
window.addEventListener('keydown', (e) => {
    if (e.key === 'j') {
        keys.left = true;
        player.lastDirection = -1; // Moving left
    }
    if (e.key === 'l') {
        keys.right = true;
        player.lastDirection = 1; // Moving right
    }
    if (e.key === 'i') keys.jump = true;
    if (e.key === ' ') { // space bar to shoot
        if (player.fireFlower) {
            // Shoot a fireball in the direction the player is facing
            const fireball = new Fireball(
                player.x + (player.lastDirection === 1 ? player.width : -10), // Adjust fireball start position based on direction
                player.y + player.height / 2 - 5, 
                player.lastDirection // Pass the direction
            );
            fireballs.push(fireball); // Add fireball to the array
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'j') keys.left = false;
    if (e.key === 'l') keys.right = false;
    if (e.key === 'i') keys.jump = false;
});


// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

const fireballs = []; // Array to hold fireballs

// Update game logic
function update() {
    // Player movement
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    // Jumping
    if (keys.jump && player.grounded) {
        player.velocityY = player.jumpPower;
        player.grounded = false;
    }

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Collision detection with terrain
    terrain.forEach(tile => {
        if (player.x < tile.x + tile.width &&
            player.x + player.width > tile.x &&
            player.y + player.height < tile.y + tile.height &&
            player.y + player.height + player.velocityY >= tile.y) {
            player.y = tile.y - player.height; // Adjust position
            player.velocityY = 0;
            player.grounded = true;
        }
    });

    // Collision detection with pipes
    pipes.forEach(pipe => {
        if (player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            player.y + player.height < pipe.y + pipe.height &&
            player.y + player.height + player.velocityY >= pipe.y) {
            player.y = pipe.y - player.height; // Adjust position
            player.velocityY = 0;
            player.grounded = true;
        }
    });

    // Collision detection with platforms
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + platform.height &&
            player.y + player.height + player.velocityY >= platform.y) {
            player.y = platform.y - player.height; // Adjust position
            player.velocityY = 0;
            player.grounded = true;
        }
    });

    // Reset player position if they fall through the ground
    if (player.y > height) {
        player.y = height - player.height;
        player.velocityY = 0;
        player.grounded = true;
    }

    // Coin collection
    coins.forEach((coin, index) => {
        if (player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            coins.splice(index, 1); // Remove the coin from the array
            player.coins += 1; // Increment coin count
        }
    });
// Check if player has enough coins for an extra life
if (player.coins >= 15) {
    lives += 1;
    player.coins = 0; // Reset coins after gaining a life
}

    // Question block interaction
    questionBlocks.forEach(block => {
        if (player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y + player.height < block.y + block.height &&
            player.y + player.height + player.velocityY >= block.y) {
            if (block.hasPowerUp) {
                block.hasPowerUp = false; // Remove the power-up from the block
                // Spawn a random power-up (mushroom or fire flower)
                const powerUpType = Math.random() < 0.5 ? 'mushroom' : 'fireFlower';
                items.push(new Item(block.x, block.y - 20, powerUpType)); // Spawn item above the block
            }
        }
    });
    
    

    
     // Check collision with flagpole
    if (player.x + player.width > flagpole.x && player.x < flagpole.x + flagpole.width && player.y + player.height >= flagpole.y) {
    }

    

    
    fireballs.forEach((fireball, index) => {
        fireball.update();
        
        // Check if fireball goes off-screen
        if (fireball.x > width || fireball.x < 0) {
            fireballs.splice(index, 1); // Remove fireball if it goes off screen
        }

        // Check collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (fireball.collidesWith(enemy)) {
                enemies.splice(enemyIndex, 1); // Remove enemy if hit by fireball
                fireballs.splice(index, 1); // Remove fireball after hit
            }
        });
    });
    
    items.forEach((item, index) => {
        item.update();
        if (item.y > height) {
            items.splice(index, 1); // Remove item if it falls off screen
        }
        // Check if player collects the item
        if (item.x < player.x + player.width &&
            item.x + item.width > player.x &&
            item.y < player.y + player.height &&
            item.y + item.height > player.y) {
            item.collect(player); // Collect item and apply effects
            items.splice(index, 1); // Remove item from the array
        }
    });

    
    // Check collision with flagpole
if (player.x + player.width > flagpole.x && player.x < flagpole.x + flagpole.width && player.y + player.height >= flagpole.y) {
    flagpole.touched = true;
    player.velocityY = 2; // Start sliding down the flagpole
    player.x = flagpole.x - player.width / 2; // Keep player aligned with the pole
    setTimeout(function() {
        levelComplete = true; // Set the level as complete
    }, 1000);
}
// Check if the player's health is 0 or below
if (player.health <= 0) {
    setTimeout(function() {
        gameOver = true;
    }, 50);
}

if (player.invincible) {
    player.invincibilityTimer -= 16.67; // Assuming 60 FPS, subtracting ~16.67 ms per frame
    if (player.invincibilityTimer <= 0) {
        player.invincible = false; // Reset invincibility
    }
}
    // Update enemies
    enemies.forEach(enemy => enemy.update());
}

//========================

// Render graphics
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw terrain
    ctx.fillStyle = 'green'; // Terrain color
    terrain.forEach(tile => {
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    });

    // Draw pipes
    ctx.fillStyle = 'darkgreen'; // Pipe color
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // Draw platforms
    ctx.fillStyle = 'lightblue'; // Platform color
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw coins
    ctx.fillStyle = 'gold'; // Coin color
    coins.forEach(coin => {
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
    });

    // Draw question blocks
    ctx.fillStyle = 'yellow'; // Question block color
    questionBlocks.forEach(block => {
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
    
    // Draw items
    items.forEach(item => item.render());
    
    // Draw fireballs
    fireballs.forEach(fireball => fireball.render());
    
    // Draw flagpole
ctx.fillStyle = 'gray';
ctx.fillRect(flagpole.x, flagpole.y, flagpole.width, flagpole.height);

    
    // Draw enemies
    enemies.forEach(enemy => enemy.render());

    // Draw player
    ctx.fillStyle = player.fireFlower ? 'orange' : (player.state === 'big' ? 'blue' : 'red'); // Color based on state
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw coin counter
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Coins: " + player.coins, 1400, 30);
    ctx.fillStyle = "white";
    ctx.fillText("Lives: " + player.health, 1400, 60);
    
    
    if (levelComplete) {
         displayLevelComplete();
         return;
    }

    if (gameOver) {
        displayGameOver();
        return;
   }
}

// Start the game loop
gameLoop();