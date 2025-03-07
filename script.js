// Jeremy Venegas - Personal Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Fix for background flickering
    preventBackgroundFlickering();
    
    // Initialize all components
    initTypewriter();
    initThemeToggle();
    initModeToggle();
    initMobileMenu();
    initGame();
    initSmoothScrolling();
    
    // Setup raccoon SVG handling
    setupRaccoonSvgIntegration();
});

// Prevent background flickering with hardware acceleration
function preventBackgroundFlickering() {
    const gameBackground = document.getElementById('game-background');
    if (gameBackground) {
        // Force hardware acceleration to prevent flickering
        gameBackground.style.transform = 'translateZ(0)';
        gameBackground.style.backfaceVisibility = 'hidden';
    }
}

// Setup raccoon SVG integration with the game
function setupRaccoonSvgIntegration() {
    const canvas = document.getElementById('game-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        
        // If game is already initialized
        if (window.game) {
            integrateRaccoonSvgWithGame(window.game, ctx);
        } else {
            // Create a global function that the game can call when it initializes
            window.updateRaccoonDesign = function(gameObj) {
                return integrateRaccoonSvgWithGame(gameObj, ctx);
            };
        }
    }
}

// Helper function to integrate raccoon SVG with game object
function integrateRaccoonSvgWithGame(gameObj, ctx) {
    // Override with SVG raccoon
    gameObj.drawPlayer = function(ctx, x, y, frameCount) {
        // Instead of drawing on canvas, position the SVG
        const raccoonSvg = document.getElementById('raccoon-svg-container');
        if (raccoonSvg) {
            raccoonSvg.style.display = 'block';
            // Position adjustment to place the raccoon on the ground
            raccoonSvg.style.transform = `translate(${x}px, ${y - 10}px) scale(1)`;
            raccoonSvg.style.transformOrigin = 'top left';
        }
    };
    
    // Also override the update method to ensure SVG follows player
    if (gameObj.raccoon && gameObj.raccoon.update) {
        const originalUpdate = gameObj.raccoon.update;
        gameObj.raccoon.update = function() {
            originalUpdate.call(gameObj.raccoon);
            gameObj.drawPlayer(ctx, gameObj.raccoon.x, gameObj.raccoon.y, 0);
        };
    }
    
    return gameObj;
}

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
    if (!themeToggleBtn) return;
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on preference
    const shouldUseDarkTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(shouldUseDarkTheme);
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update all theme-dependent elements
        updateThemeElements(isDark);
        
        // Reset and restart game if it exists
        if (window.game) {
            resetGame();
            // Wait a brief moment for theme transition
            setTimeout(() => {
                startGame();
            }, 300);
        }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });
}

// Helper function to apply theme
function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update all theme-dependent elements
    updateThemeElements(isDark);
}

// Helper function to update all theme-dependent elements
function updateThemeElements(isDark) {
    // Ensure HTML element has correct class for dark mode
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update game sky elements
    updateGameSky();
    
    // Update toggle switch appearance
    const toggleSlider = document.querySelector('.toggle-slider');
    if (toggleSlider) {
        toggleSlider.classList.toggle('dark-mode', isDark);
    }
    
    // If in designer mode, update designer-specific elements
    if (document.body.classList.contains('designer-mode')) {
        updateDesignerMode(true);
    }
}

// Designer/Developer Mode Toggle
function initModeToggle() {
    const modeToggle = document.getElementById('mode-toggle');
    if (!modeToggle) return;
    
    const body = document.body;
    
    // Check for saved mode preference
    const savedMode = localStorage.getItem('designMode');
    
    // Apply saved mode or default to developer mode
    const isDesignerMode = savedMode === 'designer';
    applyDesignerMode(isDesignerMode);
    modeToggle.checked = isDesignerMode;
    
    // Toggle mode when the switch is clicked
    modeToggle.addEventListener('change', function() {
        const isDesigner = this.checked;
        applyDesignerMode(isDesigner);
        localStorage.setItem('designMode', isDesigner ? 'designer' : 'developer');
    });
}

// Helper function to apply designer mode
function applyDesignerMode(isDesigner) {
    const body = document.body;
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDesigner) {
        body.classList.add('designer-mode');
    } else {
        body.classList.remove('designer-mode');
    }
    
    updateDesignerMode(isDesigner);
    
    // If in dark mode, ensure theme-specific elements are updated
    if (isDark) {
        updateDesignerModeForTheme(isDark);
    }
}

// Update elements for designer mode
function updateDesignerMode(isDesigner) {
    // Elements to update
    const buttons = document.querySelectorAll('button:not(.toggle-btn)');
    const cards = document.querySelectorAll('.bg-white, .dark .bg-gray-800');
    const sections = document.querySelectorAll('section');
    const body = document.body;
    
    // Reset all inline styles first to avoid conflicts
    resetAllInlineStyles();
    
    if (isDesigner) {
        // Apply designer styles to buttons
        buttons.forEach(button => {
            button.classList.add('transition-all', 'duration-300');
        });
        
        // Apply designer styles to cards
        cards.forEach(card => {
            card.classList.add('transition-all', 'duration-300');
        });
        
        // Apply spacing and styling to sections
        sections.forEach(section => {
            section.classList.add('py-24'); // More padding in designer mode
        });
        
        // Apply designer mode class
        body.classList.add('designer-mode');
        
        // Update game elements for designer mode
        const gameStartBtn = document.getElementById('game-start');
        if (gameStartBtn) {
            gameStartBtn.classList.add('transition-all', 'duration-300', 'transform', 'hover:scale-105');
        }
        
        // Style game score display
        const scoreElements = document.querySelectorAll('#game-score, #game-high-score');
        scoreElements.forEach(el => {
            el.classList.add('font-bold');
        });
    } else {
        // Remove designer mode class
        body.classList.remove('designer-mode');
        
        // Remove designer-specific classes
        buttons.forEach(button => {
            button.classList.remove('transition-all', 'duration-300');
        });
        
        cards.forEach(card => {
            card.classList.remove('transition-all', 'duration-300');
        });
        
        sections.forEach(section => {
            section.classList.remove('py-24');
        });
        
        // Remove designer styles from game elements
        const gameStartBtn = document.getElementById('game-start');
        if (gameStartBtn) {
            gameStartBtn.classList.remove('transition-all', 'duration-300', 'transform', 'hover:scale-105');
        }
        
        // Remove designer styles from score elements
        const scoreElements = document.querySelectorAll('#game-score, #game-high-score');
        scoreElements.forEach(el => {
            el.classList.remove('font-bold');
        });
    }
    
    // Update game sky elements
    updateGameSky();
}

// Helper function to reset all inline styles
function resetAllInlineStyles() {
    // Define all selectors that need style reset in a single array
    const elementsToReset = [
        'body',
        'header',
        'section',
        'footer',
        '#mobile-menu',
        '#game-container, #game-canvas, #game-background, .sky-elements',
        '#projects .rounded-lg, #projects .p-6',
        '.toggle-container, .toggle-switch, .toggle-slider',
        'h1, h2, h3, p, span, a'
    ];
    
    // Process all selectors in a single loop for better performance
    elementsToReset.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.removeAttribute('style');
        });
    });
    
    // Remove all event listeners for hover states
    const hoverElements = document.querySelectorAll('[class*="hover:bg-gray"]');
    hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', null);
        el.removeEventListener('mouseleave', null);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Use event delegation for better performance
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('open');
    });
    
    // Close mobile menu when a link is clicked using event delegation
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('open');
        }
    });
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
        // Check if the clicked element is an anchor with a hash
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Add offset for fixed header
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Helper function to update game sky elements
function updateGameSky() {
    const isDark = document.documentElement.classList.contains('dark');
    const skyElements = document.querySelector('.sky-elements');
    
    if (skyElements) {
        // Apply appropriate sky gradient based on theme using CSS variables
        if (isDark) {
            skyElements.style.background = `linear-gradient(to bottom, 
                var(--game-sky-start) 0%, 
                var(--game-sky-mid, var(--game-sky-start)) 50%, 
                var(--game-sky-end) 100%)`;
        } else {
            skyElements.style.background = `linear-gradient(to bottom, 
                var(--game-sky-start) 0%, 
                var(--game-sky-end) 100%)`;
        }
    }
    
    // Update raccoon SVG colors for dark mode
    const raccoonSvg = document.getElementById('raccoon-svg-container');
    if (raccoonSvg) {
        const svgElements = raccoonSvg.querySelectorAll('rect');
        svgElements.forEach(rect => {
            const currentFill = rect.getAttribute('fill');
            // Only update colors that need to change
            if (isDark) {
                if (currentFill === '#808080') {
                    rect.setAttribute('fill', '#9ca3af');
                } else if (currentFill === '#404040') {
                    rect.setAttribute('fill', '#6b7280');
                }
            } else {
                if (currentFill === '#9ca3af') {
                    rect.setAttribute('fill', '#808080');
                } else if (currentFill === '#6b7280') {
                    rect.setAttribute('fill', '#404040');
                }
            }
        });
    }
}

// Raccoon Game Implementation
function initGame() {
    // Cache DOM elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameStartBtn = document.getElementById('game-start');
    const scoreDisplay = document.getElementById('game-score');
    const highScoreDisplay = document.getElementById('game-high-score');
    const raccoonSvgContainer = document.getElementById('raccoon-svg-container');
    
    // Game constants - grouped by purpose for better readability
    const GAME_CONSTANTS = {
        SPEED: {
            INITIAL: 5,
            GRAVITY: 0.6,
            JUMP_FORCE: 12
        },
        OBSTACLES: {
            INITIAL_INTERVAL: 1800,
            MIN_INTERVAL: 1000
        },
        POSITIONS: {
            RACCOON_X: 50,
            GROUND_OFFSET: 20
        },
        DIFFICULTY: {
            INCREASE_INTERVAL: 5 // Score points between difficulty increases
        }
    };
    
    // Game state variables - grouped in a state object for better organization
    const gameState = {
        active: false,
        score: 0,
        highScore: parseInt(localStorage.getItem('raccoonGameHighScore') || 0),
        speed: GAME_CONSTANTS.SPEED.INITIAL,
        obstacleInterval: GAME_CONSTANTS.OBSTACLES.INITIAL_INTERVAL,
        lastObstacleTime: 0,
        animationId: null,
        groundLevel: 0,
        difficultyLevel: 1,
        obstacles: []
    };
    
    // Initialize sky elements for day/night
    updateGameSky();
    
    // Game objects
    const raccoon = {
        x: GAME_CONSTANTS.POSITIONS.RACCOON_X,
        y: 0,
        width: 30,
        height: 40,
        velocityY: 0,
        jumping: false,
        
        update() {
            // Apply gravity
            this.velocityY += GAME_CONSTANTS.SPEED.GRAVITY;
            this.y += this.velocityY;
            
            // Ground collision
            if (this.y + this.height > gameState.groundLevel) {
                this.y = gameState.groundLevel - this.height;
                this.velocityY = 0;
                this.jumping = false;
            }
        },
        
        jump() {
            if (!this.jumping) {
                this.velocityY = -GAME_CONSTANTS.SPEED.JUMP_FORCE;
                this.jumping = true;
            }
        },
        
        // Fallback draw method if SVG isn't available
        draw() {
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
        }
    };
    
    // Handle SVG raccoon rendering - extracted to a separate function for better organization
    function setupRaccoonSvg() {
        // SVG raccoon renderer
        function drawRaccoonSvg(x, y) {
            if (raccoonSvgContainer) {
                raccoonSvgContainer.style.display = 'block';
                // Position adjustment to place the raccoon on the ground
                raccoonSvgContainer.style.transform = `translate(${x}px, ${y + 8}px) scale(1)`;
                raccoonSvgContainer.style.transformOrigin = 'top left';
            } else {
                // Fallback to original drawing if SVG not available
                raccoon.draw();
            }
        }
        
        // Override the raccoon's draw method to use SVG
        raccoon.draw = function() {
            drawRaccoonSvg(this.x, this.y);
        };
        
        // Make the game object available globally for potential extensions
        window.game = {
            raccoon: raccoon,
            drawPlayer: drawRaccoonSvg
        };
    }
    
    // Initialize raccoon SVG
    setupRaccoonSvg();
    
    // Obstacle class - optimized with destructuring for cleaner code
    class Obstacle {
        constructor() {
            const isDark = document.documentElement.classList.contains('dark');
            const { difficultyLevel } = gameState;
            
            // Vary the width and height based on difficulty
            const maxHeight = 15 + (difficultyLevel * 2);
            const minHeight = 15;
            
            // Add more height variation
            this.width = 20 + Math.random() * 15;
            
            // Make obstacles significantly taller in night mode
            if (isDark) {
                // Much taller obstacles in night mode
                const nightModeHeightBonus = 20 + (difficultyLevel * 3); // Additional height for night mode
                this.height = minHeight + Math.random() * (maxHeight - minHeight) + nightModeHeightBonus;
            } else {
                // Normal height in day mode
                const heightVariation = Math.random() * 10;
                this.height = minHeight + Math.random() * (maxHeight - minHeight) + heightVariation;
            }
            
            this.x = canvas.width;
            this.y = gameState.groundLevel - this.height;
            this.passed = false;
            
            // Vary the color for visual interest
            const hue = Math.floor(Math.random() * 360);
            
            // Make obstacles bright and easy to see in both modes
            if (isDark) {
                // Brighter colors in night mode for better visibility
                this.color = `hsl(${hue}, 50%, 45%)`; // More saturated and brighter
                this.lidColor = `hsl(${hue}, 40%, 65%)`; // Brighter lid
            } else {
                this.color = `hsl(${hue}, 30%, 40%)`;
                this.lidColor = `hsl(${hue}, 20%, 60%)`;
            }
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
            this.x -= gameState.speed;
            
            // Check if obstacle is passed and update score
            if (!this.passed && this.x + this.width < raccoon.x) {
                gameState.score++;
                this.passed = true;
                scoreDisplay.textContent = gameState.score;
                
                // Update high score if needed
                if (gameState.score > gameState.highScore) {
                    gameState.highScore = gameState.score;
                    highScoreDisplay.textContent = gameState.highScore;
                    localStorage.setItem('raccoonGameHighScore', gameState.highScore);
                }
                
                // Increase difficulty based on score
                if (gameState.score % GAME_CONSTANTS.DIFFICULTY.INCREASE_INTERVAL === 0) {
                    increaseDifficulty();
                }
            }
            
            return this.x + this.width < 0; // Return true if obstacle is off screen
        }
    }
    
    // Increase game difficulty - optimized with destructuring
    function increaseDifficulty() {
        const isDark = document.documentElement.classList.contains('dark');
        gameState.difficultyLevel += 0.5;
        
        // Make the game harder in night mode
        if (isDark) {
            gameState.speed += 0.8; // Much faster in night mode (0.8 instead of 0.4)
            
            // Decrease obstacle interval much more aggressively in night mode
            gameState.obstacleInterval = Math.max(
                GAME_CONSTANTS.OBSTACLES.MIN_INTERVAL - 300, // Much lower minimum interval in night mode
                GAME_CONSTANTS.OBSTACLES.INITIAL_INTERVAL - (gameState.difficultyLevel * 200) // Much faster decrease
            );
        } else {
            gameState.speed += 0.4;
            
            // Normal difficulty in day mode
            gameState.obstacleInterval = Math.max(
                GAME_CONSTANTS.OBSTACLES.MIN_INTERVAL,
                GAME_CONSTANTS.OBSTACLES.INITIAL_INTERVAL - (gameState.difficultyLevel * 100)
            );
        }
    }
    
    // Resize canvas to fit its container properly
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gameState.groundLevel = canvas.height - GAME_CONSTANTS.POSITIONS.GROUND_OFFSET;
        
        // Reset raccoon position after resize
        if (!gameState.active) {
            raccoon.y = gameState.groundLevel - raccoon.height;
        }
    }
    
    // Event listeners - using event delegation where possible
    window.addEventListener('resize', resizeCanvas);
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameState.active) {
            e.preventDefault(); // Prevent page scroll on spacebar
            raccoon.jump();
        }
    });
    
    canvas.addEventListener('click', function() {
        if (gameState.active) {
            raccoon.jump();
        }
    });
    
    gameStartBtn.addEventListener('click', function() {
        if (!gameState.active) {
            startGame();
        } else {
            resetGame();
        }
    });
    
    // Game state management
    function startGame() {
        resizeCanvas();
        // Reset game state
        Object.assign(gameState, {
            active: true,
            score: 0,
            speed: GAME_CONSTANTS.SPEED.INITIAL,
            difficultyLevel: 1,
            obstacleInterval: GAME_CONSTANTS.OBSTACLES.INITIAL_INTERVAL,
            obstacles: [],
            lastObstacleTime: performance.now()
        });
        
        // Reset raccoon
        raccoon.y = gameState.groundLevel - raccoon.height;
        raccoon.velocityY = 0;
        
        // Update UI
        scoreDisplay.textContent = gameState.score;
        highScoreDisplay.textContent = gameState.highScore;
        gameStartBtn.textContent = 'Reset Game';
        
        // Start game loop
        requestAnimationFrame(gameLoop);
    }
    
    function resetGame() {
        cancelAnimationFrame(gameState.animationId);
        gameState.active = false;
        gameStartBtn.textContent = 'Start Game';
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Show initial state
        drawBackground();
        raccoon.y = gameState.groundLevel - raccoon.height;
        raccoon.draw();
    }
    
    function gameOver() {
        gameState.active = false;
        gameStartBtn.textContent = 'Try Again';
        
        // Hide the SVG raccoon
        if (raccoonSvgContainer) {
            raccoonSvgContainer.style.display = 'none';
        }
        
        // Draw game over message with better visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '16px "Fira Code", monospace';
        ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
    
    // Game rendering
    function drawBackground() {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Get computed styles to access CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const groundColor = computedStyle.getPropertyValue('--game-ground').trim();
        
        // Draw background cityscape with parallax
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(148, 163, 184, 0.3)'; // Brighter in dark mode
        
        // Create a more randomized cityscape that spawns from the right
        // Significantly reduce the speed to create distant background effect
        const baseSpeed = 0.15;
        const scrollSpeed = gameState.speed * baseSpeed;
        
        // Store building data in a persistent array if it doesn't exist yet
        if (!window.cityBuildings) {
            // Initialize buildings array with randomized properties
            window.cityBuildings = [];
            
            // Create enough buildings to fill the screen plus buffer for off-screen
            const screenWidth = canvas.width;
            let currentX = 0;
            
            // Add buildings until we've covered the screen width plus buffer
            while (currentX < screenWidth * 2) {
                // Randomize building properties
                const width = 40 + Math.random() * 60; // Random width between 40-100
                const height = 30 + Math.random() * 50; // Random height between 30-80
                const gap = 15 + Math.random() * 30; // Random gap between buildings
                
                // Pre-generate window pattern to avoid flickering
                const windowSize = 6;
                const windowMargin = 10;
                const windowRows = Math.floor(height / windowMargin) - 1;
                const windowCols = Math.floor(width / 15);
                const windows = [];
                
                // Generate persistent window pattern
                for (let row = 0; row < windowRows; row++) {
                    for (let col = 0; col < windowCols; col++) {
                        // Randomly decide if this window should be visible
                        if (Math.random() > 0.3) {
                            windows.push({
                                row: row,
                                col: col
                            });
                        }
                    }
                }
                
                // Add building to array
                window.cityBuildings.push({
                    x: currentX,
                    width: width,
                    height: height,
                    windows: windows
                });
                
                // Move to next building position
                currentX += width + gap;
            }
        }
        
        // Update building positions based on game speed
        window.cityBuildings.forEach(building => {
            building.x -= scrollSpeed;
            
            // If building is completely off-screen to the left, move it to the right
            if (building.x + building.width < 0) {
                const rightmostX = Math.max(...window.cityBuildings.map(b => b.x + b.width));
                building.width = 40 + Math.random() * 60;
                building.height = 30 + Math.random() * 50;
                const gap = 15 + Math.random() * 30;
                building.x = rightmostX + gap;
                
                // Generate new window pattern
                const windowRows = Math.floor(building.height / 10) - 1;
                const windowCols = Math.floor(building.width / 15);
                building.windows = [];
                
                for (let row = 0; row < windowRows; row++) {
                    for (let col = 0; col < windowCols; col++) {
                        if (Math.random() > 0.3) {
                            building.windows.push({ row, col });
                        }
                    }
                }
            }
            
            // Draw building with better contrast in dark mode
            ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(148, 163, 184, 0.3)';
            ctx.fillRect(building.x, gameState.groundLevel - building.height, building.width, building.height);
            
            // Add windows to buildings with better visibility in dark mode
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(51, 65, 85, 0.2)';
            
            // Draw windows
            const windowSize = 6;
            const windowMargin = 10;
            
            building.windows.forEach(window => {
                const windowX = building.x + (window.col + 1) * (building.width / (Math.floor(building.width / 15) + 1)) - windowSize/2;
                const windowY = gameState.groundLevel - building.height + windowMargin + window.row * windowMargin;
                ctx.fillRect(windowX, windowY, windowSize, windowSize);
            });
        });
        
        // Draw sun/moon
        const centerX = canvas.width * 0.8;
        const centerY = canvas.height * 0.2;
        const size = 24; // Size of the cube
        
        if (isDark) {
            // Moon - simple white square
            ctx.fillStyle = '#e5e7eb'; // Light gray for moon
            ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
            
            // Simple pixel details
            ctx.fillStyle = '#d1d5db'; // Slightly darker for details
            ctx.fillRect(centerX - size/4, centerY - size/4, size/4, size/4);
            ctx.fillRect(centerX + size/8, centerY + size/8, size/4, size/4);
        } else {
            // Sun - yellow square
            ctx.fillStyle = '#fbbf24'; // Warm yellow for sun
            ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
            
            // Simple pixel details
            ctx.fillStyle = '#fcd34d'; // Lighter yellow for details
            ctx.fillRect(centerX - size/4, centerY - size/4, size/2, size/2);
        }
        
        // Ground
        ctx.fillStyle = groundColor;
        ctx.fillRect(0, gameState.groundLevel, canvas.width, canvas.height - gameState.groundLevel);
    }
    
    // Collision detection
    function checkCollision(raccoon, obstacle) {
        // Use a slightly smaller hitbox for more forgiving gameplay
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
    
    // Main game loop
    function gameLoop(timestamp) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Update raccoon position
        raccoon.update();
        raccoon.draw();
        
        // Generate obstacles periodically, with variable timing
        if (timestamp - gameState.lastObstacleTime > gameState.obstacleInterval) {
            gameState.obstacles.push(new Obstacle());
            gameState.lastObstacleTime = timestamp;
            
            // Randomize next obstacle timing based on difficulty
            const variability = 400 - (gameState.difficultyLevel * 20);
            gameState.obstacleInterval = Math.max(
                GAME_CONSTANTS.OBSTACLES.MIN_INTERVAL,
                gameState.obstacleInterval - (gameState.difficultyLevel * 10) + (Math.random() * variability)
            );
        }
        
        // Update and draw obstacles, removing those that are off screen
        gameState.obstacles = gameState.obstacles.filter(obstacle => {
            obstacle.draw();
            const isOffScreen = obstacle.update();
            
            // Check for collision
            if (checkCollision(raccoon, obstacle)) {
                gameOver();
                return false;
            }
            
            return !isOffScreen; // Keep obstacles that are still on screen
        });
        
        // Continue game loop
        if (gameState.active) {
            gameState.animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    // Initialize the game
    resizeCanvas();
    resetGame();
}