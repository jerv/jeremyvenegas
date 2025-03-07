// Jeremy Venegas - Personal Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typed.js for typewriter effect
    initTypewriter();
    
    // Initialize theme toggling
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize raccoon game
    initGame();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
});

// Typewriter effect with Typed.js
function initTypewriter() {
    const options = {
        strings: [
            "Hi, I'm Jeremy Venegas",
            "Developer & Designer",
            "Building impactful digital experiences"
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 500,
        loop: true
    };
    
    new Typed('#typed-text', options);
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If there's a saved theme, use that, otherwise use device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update game sky elements if game exists
        updateGameSky();
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('open');
    });
    
    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('open');
        });
    });
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Updates the game sky based on current theme
function updateGameSky() {
    const skyElements = document.querySelector('.sky-elements');
    if (!skyElements) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    
    // Remove existing elements
    skyElements.innerHTML = '';
    
    if (isDark) {
        // Add moon
        const moon = document.createElement('div');
        moon.className = 'absolute w-16 h-16 bg-gray-200 rounded-full';
        moon.style.right = '2rem';
        moon.style.top = '1rem';
        moon.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        skyElements.appendChild(moon);
    } else {
        // Add sun
        const sun = document.createElement('div');
        sun.className = 'absolute w-16 h-16 bg-yellow-300 rounded-full';
        sun.style.right = '2rem';
        sun.style.top = '1rem';
        sun.style.boxShadow = '0 0 40px rgba(250, 204, 21, 0.6)';
        skyElements.appendChild(sun);
    }
}

// Raccoon Game Implementation
function initGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameStartBtn = document.getElementById('game-start');
    const scoreDisplay = document.getElementById('game-score');
    const highScoreDisplay = document.getElementById('game-high-score');
    
    // Game variables
    let gameActive = false;
    let score = 0;
    let highScore = localStorage.getItem('raccoonGameHighScore') || 0;
    let gameSpeed = 5;
    let gravity = 0.6;
    let jumpForce = 12;
    let obstacleInterval = 1800; // Starting interval between obstacles
    let minObstacleInterval = 1000; // Min time between obstacles at high difficulty
    let lastObstacleTime = 0;
    let animationId;
    let groundLevel;
    let difficultyLevel = 1; // Game difficulty increases over time
    
    // Initialize sky elements for day/night
    updateGameSky();
    
    // Game objects
    const raccoon = {
        x: 50,
        y: 0,
        width: 30,
        height: 40,
        velocityY: 0,
        jumping: false,
        draw: function() {
            // Body
            ctx.fillStyle = '#525252';
            ctx.fillRect(this.x, this.y, this.width, this.height - 10);
            
            // Legs animation
            const legOffset = Math.sin(Date.now() / 100) * 5;
            ctx.fillStyle = '#424242';
            // Front leg
            ctx.fillRect(this.x + 5, this.y + this.height - 10, 6, 10 + legOffset);
            // Back leg
            ctx.fillRect(this.x + this.width - 11, this.y + this.height - 10, 6, 10 - legOffset);
            
            // Face mask
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(this.x + 5, this.y + 10, this.width - 10, 15);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + 8, this.y + 15, 4, 4);
            ctx.fillRect(this.x + this.width - 12, this.y + 15, 4, 4);
            
            // Nose
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + (this.width/2) - 2, this.y + 22, 4, 4);
            
            // Raccoon tail (curved and striped)
            ctx.fillStyle = '#525252';
            ctx.beginPath();
            ctx.moveTo(this.x - 5, this.y + 15);
            ctx.quadraticCurveTo(
                this.x - 15, 
                this.y + 20,
                this.x - 10, 
                this.y + 25
            );
            ctx.lineTo(this.x - 5, this.y + 25);
            ctx.quadraticCurveTo(
                this.x - 8,
                this.y + 20,
                this.x - 2,
                this.y + 15
            );
            ctx.fill();
            
            // Tail stripes
            ctx.strokeStyle = '#303030';
            ctx.lineWidth = 2;
            for(let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(this.x - 12 + (i * 3), this.y + 17);
                ctx.lineTo(this.x - 8 + (i * 3), this.y + 23);
                ctx.stroke();
            }
        },
        update: function() {
            // Apply gravity
            this.velocityY += gravity;
            this.y += this.velocityY;
            
            // Ensure raccoon stays on ground
            if (this.y > groundLevel - this.height) {
                this.y = groundLevel - this.height;
                this.velocityY = 0;
                this.jumping = false;
            }
        },
        jump: function() {
            if (!this.jumping) {
                this.velocityY = -jumpForce;
                this.jumping = true;
            }
        }
    };
    
    const obstacles = [];
    
    class Obstacle {
        constructor() {
            // Vary the width and height based on difficulty
            const maxHeight = 15 + (difficultyLevel * 2); // Height increases with difficulty
            const minHeight = 15;
            
            this.width = 20 + Math.random() * 15;
            this.height = minHeight + Math.random() * (maxHeight - minHeight);
            this.x = canvas.width;
            this.y = groundLevel - this.height;
            this.passed = false;
            
            // Vary the color for visual interest
            const hue = Math.floor(Math.random() * 360); // Random hue
            this.color = `hsl(${hue}, 30%, 40%)`;
            this.lidColor = `hsl(${hue}, 20%, 60%)`;
        }
        
        draw() {
            // Draw a colorful trash can
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Trash can lid
            ctx.fillStyle = this.lidColor;
            ctx.fillRect(this.x - 2, this.y, this.width + 4, 5);
            
            // Add some lines for detail with better contrast
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + 3, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width - 3, this.y + this.height / 2);
            ctx.stroke();
        }
        
        update() {
            this.x -= gameSpeed;
            
            // Check if obstacle is passed and update score
            if (!this.passed && this.x + this.width < raccoon.x) {
                score++;
                this.passed = true;
                scoreDisplay.textContent = score;
                
                // Update high score if needed
                if (score > highScore) {
                    highScore = score;
                    highScoreDisplay.textContent = highScore;
                    localStorage.setItem('raccoonGameHighScore', highScore);
                }
                
                // Increase difficulty based on score
                if (score % 5 === 0) {
                    difficultyLevel += 0.5;
                    gameSpeed += 0.4;
                    
                    // Decrease obstacle interval as difficulty increases
                    obstacleInterval = Math.max(
                        minObstacleInterval, 
                        1800 - (difficultyLevel * 100)
                    );
                }
            }
        }
    }
    
    // Resize canvas to fit its container properly
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        groundLevel = canvas.height - 20; // 20px from bottom
        
        // Reset raccoon position after resize
        if (!gameActive) {
            raccoon.y = groundLevel - raccoon.height;
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Key controls for jumping
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameActive) {
            e.preventDefault(); // Prevent page scroll on spacebar
            raccoon.jump();
        }
    });
    
    // Click/tap controls for jumping
    canvas.addEventListener('click', function() {
        if (gameActive) {
            raccoon.jump();
        }
    });
    
    // Start game button
    gameStartBtn.addEventListener('click', function() {
        if (!gameActive) {
            startGame();
        } else {
            resetGame();
        }
    });
    
    function startGame() {
        resizeCanvas();
        gameActive = true;
        score = 0;
        gameSpeed = 5;
        difficultyLevel = 1;
        obstacleInterval = 1800;
        obstacles.length = 0;
        raccoon.y = groundLevel - raccoon.height;
        raccoon.velocityY = 0;
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
        gameStartBtn.textContent = 'Reset Game';
        
        // Start game loop
        gameLoop();
    }
    
    function resetGame() {
        cancelAnimationFrame(animationId);
        gameActive = false;
        gameStartBtn.textContent = 'Start Game';
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Show initial state
        drawBackground();
        raccoon.y = groundLevel - raccoon.height;
        raccoon.draw();
    }
    
    function gameLoop(timestamp) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Update and draw raccoon
        raccoon.update();
        raccoon.draw();
        
        // Generate obstacles periodically, with variable timing
        if (!lastObstacleTime) lastObstacleTime = timestamp;
        
        const timeSinceLastObstacle = timestamp - lastObstacleTime;
        if (timeSinceLastObstacle > obstacleInterval) {
            obstacles.push(new Obstacle());
            lastObstacleTime = timestamp;
            
            // Randomize next obstacle timing based on difficulty
            const variability = 400 - (difficultyLevel * 20); // Less variability as difficulty increases
            obstacleInterval = Math.max(
                minObstacleInterval,
                obstacleInterval - (difficultyLevel * 10) + (Math.random() * variability)
            );
        }
        
        // Update and draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();
            
            // Check for collision
            if (checkCollision(raccoon, obstacles[i])) {
                gameOver();
                return;
            }
            
            // Remove obstacles that are off screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
        
        // Continue game loop
        if (gameActive) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function drawBackground() {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Ground color based on theme - solid color, no texture
        ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);
        
        // Draw background cityscape with parallax
        ctx.fillStyle = isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(148, 163, 184, 0.3)';
        const parallaxOffset = (Date.now() / 50) % 60; // Slow movement
        
        for (let i = -60; i < canvas.width + 60; i += 60) {
            const x = (i - parallaxOffset) % (canvas.width + 120) - 60;
            const height = 15 + Math.sin(i * 0.01) * 10;
            ctx.fillRect(x, groundLevel - height, 40, height);
            
            // Add faint windows to buildings
            ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(51, 65, 85, 0.2)';
            for (let j = groundLevel - height + 5; j < groundLevel - 5; j += 7) {
                ctx.fillRect(x + 10, j, 5, 5);
                ctx.fillRect(x + 25, j, 5, 5);
            }
        }
    }
    
    function checkCollision(raccoon, obstacle) {
        // Keep the more forgiving collision detection
        const raccoonHitbox = {
            x: raccoon.x + 5,
            y: raccoon.y + 5,
            width: raccoon.width - 10,
            height: raccoon.height - 5
        };
        
        return raccoonHitbox.x < obstacle.x + obstacle.width - 2 &&
               raccoonHitbox.x + raccoonHitbox.width - 2 > obstacle.x &&
               raccoonHitbox.y < obstacle.y + obstacle.height - 2 &&
               raccoonHitbox.y + raccoonHitbox.height > obstacle.y;
    }
    
    function gameOver() {
        gameActive = false;
        gameStartBtn.textContent = 'Try Again';
        
        // Draw game over message with better visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '16px "Fira Code", monospace';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
    
    // Initialize the game in "ready to start" state
    resizeCanvas();
    drawBackground();
    raccoon.y = groundLevel - raccoon.height;
    raccoon.draw();
    highScoreDisplay.textContent = highScore;
}

// Add GitHub Pages deployment comment
/* 
DEPLOYMENT INSTRUCTIONS:
To deploy to GitHub Pages:
1. Create a GitHub repository (ideally username.github.io)
2. Push these files (index.html, styles.css, script.js) to the repository
3. Go to repository Settings > Pages
4. Select the branch to deploy (usually main)
5. Your site will be published at https://username.github.io/
*/ 