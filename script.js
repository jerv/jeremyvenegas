// Jeremy Venegas - Personal Website JavaScript

/**
 * Main initialization function that runs when the DOM is fully loaded
 * Sets up all interactive elements and functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    initTypewriter();
    initThemeToggle();
    initModeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initGame();
    initResumeDownload();
});

/**
 * Initialize typewriter effect on the homepage
 * Uses Typed.js library for text animation
 */
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

/**
 * Initialize dark/light theme toggle functionality
 * Handles user preference, localStorage persistence, and theme switching
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    // Check for saved theme preference, otherwise use light mode as default
    const savedTheme = localStorage.getItem('theme');
    
    // Apply the appropriate theme - default to light mode
    const shouldUseDarkTheme = savedTheme === 'dark';
    if (shouldUseDarkTheme) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Initial update of theme-dependent elements
    updateThemeElements(document.documentElement.classList.contains('dark'));
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
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
}

/**
 * Update all theme-dependent elements based on current theme
 * @param {boolean} isDark - Whether dark mode is active
 */
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

    // Update game elements if they exist
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.maxWidth = '700px';
        gameContainer.style.borderRadius = '16px';
        gameContainer.style.overflow = 'hidden';
        
        const gameCanvas = document.getElementById('game-canvas');
        if (gameCanvas) {
            gameCanvas.style.borderRadius = '0';
        }
    }

    // Apply consistent styling to action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.style.borderRadius = '8px';
        button.style.fontWeight = '500';
        button.style.letterSpacing = '0.5px';
        
        // Ensure the button has the correct background color in designer mode
        if (button.id === 'download-resume') {
            // Remove designer-mode-active class if it exists
            button.classList.remove('designer-mode-active');
        }
    });
}

/**
 * Initialize designer/developer mode toggle functionality
 * Handles user preference and localStorage persistence
 */
function initModeToggle() {
    const modeToggle = document.getElementById('mode-toggle');
    if (!modeToggle) return;
    
    const body = document.body;
    
    // Check for saved mode preference
    const savedMode = localStorage.getItem('designMode');
    
    // Apply saved mode or default to developer mode
    if (savedMode === 'designer') {
        body.classList.add('designer-mode');
        modeToggle.checked = true;
        updateDesignerMode(true);
    } else {
        body.classList.remove('designer-mode');
        modeToggle.checked = false;
        updateDesignerMode(false);
    }
    
    // Toggle mode when switch is clicked
    modeToggle.addEventListener('change', function() {
        const isDesigner = this.checked;
        
        if (isDesigner) {
            body.classList.add('designer-mode');
            localStorage.setItem('designMode', 'designer');
        } else {
            body.classList.remove('designer-mode');
            localStorage.setItem('designMode', 'developer');
        }
        
        updateDesignerMode(isDesigner);
        
        // Reset and restart game if it exists
        if (window.game) {
            resetGame();
            // Wait a brief moment for mode transition
            setTimeout(() => {
                startGame();
            }, 300);
        }
    });
}

/**
 * Update all designer-mode specific elements
 * @param {boolean} isDesigner - Whether designer mode is active
 */
function updateDesignerMode(isDesigner) {
    // Get all elements that need to be updated
    const body = document.body;
    const isDark = document.documentElement.classList.contains('dark');
    
    // Reset any inline styles that might have been applied
    resetAllInlineStyles();
    
    if (isDesigner) {
        // Apply designer mode styles
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            heading.style.fontFamily = "'Montserrat', sans-serif";
            heading.style.fontWeight = "600";
        });
        
        document.querySelectorAll('p, span, a, button, li').forEach(element => {
            if (!element.closest('.toggle-container') && !element.classList.contains('mode-label')) {
                element.style.fontFamily = "'Inter', sans-serif";
            }
        });
        
        // Apply rounded corners to various elements
        document.querySelectorAll('.rounded-md, .rounded-lg, .rounded-full').forEach(element => {
            const currentBorderRadius = window.getComputedStyle(element).borderRadius;
            if (currentBorderRadius !== '0px') {
                element.style.borderRadius = '12px';
            }
        });
        
        // Adjust button styles
        document.querySelectorAll('button:not(.toggle-btn):not(.action-button)').forEach(button => {
            button.style.fontWeight = "500";
        });
        
        // Update game elements if they exist
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.maxWidth = '700px';
            gameContainer.style.borderRadius = '16px';
            gameContainer.style.overflow = 'hidden';
            
            const gameCanvas = document.getElementById('game-canvas');
            if (gameCanvas) {
                gameCanvas.style.borderRadius = '0';
            }
            
            const gameStart = document.getElementById('game-start');
            if (gameStart) {
                gameStart.style.borderRadius = '8px';
                gameStart.style.fontWeight = '500';
                gameStart.style.letterSpacing = '0.5px';
            }
        }
    } else {
        // Reset to developer mode (default styles will apply via CSS)
    }
    
    // Update game sky regardless of mode
    updateGameSky();
}

/**
 * Reset all inline styles that might have been applied by mode switching
 * This ensures clean transitions between modes
 */
function resetAllInlineStyles() {
    // Reset heading styles
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        heading.style.fontFamily = '';
        heading.style.fontWeight = '';
    });
    
    // Reset text element styles
    document.querySelectorAll('p, span, a, button, li').forEach(element => {
        element.style.fontFamily = '';
    });
    
    // Reset rounded elements
    document.querySelectorAll('.rounded-md, .rounded-lg, .rounded-full').forEach(element => {
        element.style.borderRadius = '';
    });
    
    // Reset button styles
    document.querySelectorAll('button').forEach(button => {
        button.style.fontWeight = '';
        button.style.letterSpacing = '';
    });
    
    // Reset game container styles
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.maxWidth = '';
        gameContainer.style.borderRadius = '';
        gameContainer.style.overflow = '';
        
        const gameCanvas = document.getElementById('game-canvas');
        if (gameCanvas) {
            gameCanvas.style.borderRadius = '';
        }
        
        const gameStart = document.getElementById('game-start');
        if (gameStart) {
            gameStart.style.borderRadius = '';
            gameStart.style.fontWeight = '';
            gameStart.style.letterSpacing = '';
        }
    }
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        
        // Accessibility: Update aria attributes
        const isExpanded = mobileMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenu.setAttribute('aria-hidden', !isExpanded);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Close mobile menu if it's open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
            
            // Scroll to the target element
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Helper function to update game sky elements
function updateGameSky() {
    const isDark = document.documentElement.classList.contains('dark');
    const skyElements = document.querySelector('.sky-elements');
    
    if (skyElements) {
        // Apply appropriate sky gradient based on theme
        if (isDark) {
            skyElements.style.background = 'linear-gradient(to bottom, #0F2027 0%, #203A43 50%, #2C5364 100%)';
        } else {
            skyElements.style.background = 'linear-gradient(to bottom, #87CEEB 0%, #B0E2FF 100%)';
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
    
    // Game constants
    const INITIAL_GAME_SPEED = 5;
    const GRAVITY = 0.6;
    const JUMP_FORCE = 12;
    const INITIAL_OBSTACLE_INTERVAL = 1800;
    const MIN_OBSTACLE_INTERVAL = 1000;
    const RACCOON_X_POSITION = 50;
    const GROUND_OFFSET = 20;
    const DIFFICULTY_INCREASE_INTERVAL = 5; // Score points between difficulty increases
    
    // Game state variables
    let gameActive = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('raccoonGameHighScore') || 0);
    let gameSpeed = INITIAL_GAME_SPEED;
    let obstacleInterval = INITIAL_OBSTACLE_INTERVAL;
    let lastObstacleTime = 0;
    let animationId;
    let groundLevel;
    let difficultyLevel = 1;
    let obstacles = [];
    
    // Initialize sky elements for day/night
    updateGameSky();
    
    // Game objects
    const raccoon = {
        x: RACCOON_X_POSITION,
        y: 0,
        width: 30,
        height: 40,
        velocityY: 0,
        jumping: false,
        
        update() {
            // Apply gravity
            this.velocityY += GRAVITY;
            this.y += this.velocityY;
            
            // Ground collision
            if (this.y + this.height > groundLevel) {
                this.y = groundLevel - this.height;
                this.velocityY = 0;
                this.jumping = false;
            }
        },
        
        jump() {
            if (!this.jumping) {
                this.velocityY = -JUMP_FORCE;
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
    
    // Obstacle class
    class Obstacle {
        constructor() {
            const isDark = document.documentElement.classList.contains('dark');
            
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
            this.y = groundLevel - this.height;
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
                if (score % DIFFICULTY_INCREASE_INTERVAL === 0) {
                    increaseDifficulty();
                }
            }
            
            return this.x + this.width < 0; // Return true if obstacle is off screen
        }
    }
    
    // Increase game difficulty
    function increaseDifficulty() {
        const isDark = document.documentElement.classList.contains('dark');
        difficultyLevel += 0.5;
        
        // Make the game harder in night mode
        if (isDark) {
            gameSpeed += 0.8; // Much faster in night mode (0.8 instead of 0.4)
            
            // Decrease obstacle interval much more aggressively in night mode
            obstacleInterval = Math.max(
                MIN_OBSTACLE_INTERVAL - 300, // Much lower minimum interval in night mode
                INITIAL_OBSTACLE_INTERVAL - (difficultyLevel * 200) // Much faster decrease
            );
        } else {
            gameSpeed += 0.4;
            
            // Normal difficulty in day mode
            obstacleInterval = Math.max(
                MIN_OBSTACLE_INTERVAL,
                INITIAL_OBSTACLE_INTERVAL - (difficultyLevel * 100)
            );
        }
    }
    
    // Resize canvas to fit its container properly
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        groundLevel = canvas.height - GROUND_OFFSET;
        
        // Reset raccoon position after resize
        if (!gameActive) {
            raccoon.y = groundLevel - raccoon.height;
        } else {
            // If game is active, reset and restart it
            resetGame();
            setTimeout(() => {
                startGame();
            }, 100); // Small delay to ensure proper canvas sizing
        }
    }
    
    // Event listeners
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize event to prevent multiple resets
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameActive) {
            e.preventDefault(); // Prevent page scroll on spacebar
            raccoon.jump();
        }
    });
    
    canvas.addEventListener('click', function() {
        if (gameActive) {
            raccoon.jump();
        }
    });
    
    gameStartBtn.addEventListener('click', function() {
        if (!gameActive) {
            startGame();
        } else {
            resetGame();
        }
    });
    
    // Game state management
    function startGame() {
        resizeCanvas();
        gameActive = true;
        score = 0;
        gameSpeed = INITIAL_GAME_SPEED;
        difficultyLevel = 1;
        obstacleInterval = INITIAL_OBSTACLE_INTERVAL;
        obstacles = [];
        raccoon.y = groundLevel - raccoon.height;
        raccoon.velocityY = 0;
        scoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
        
        // Update button text and icon
        document.getElementById('game-button-text').textContent = 'Reset Game';
        
        // Hide play icon, show reset icon
        document.querySelector('.play-icon').classList.add('hidden');
        document.querySelector('.try-again-icon').classList.add('hidden');
        document.querySelector('.reset-icon').classList.remove('hidden');
        
        // Start game loop
        lastObstacleTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    function resetGame() {
        cancelAnimationFrame(animationId);
        gameActive = false;
        
        // Update button text and icon
        document.getElementById('game-button-text').textContent = 'Play Game';
        
        // Show play icon, hide other icons
        document.querySelector('.play-icon').classList.remove('hidden');
        document.querySelector('.try-again-icon').classList.add('hidden');
        document.querySelector('.reset-icon').classList.add('hidden');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Show initial state
        drawBackground();
        raccoon.y = groundLevel - raccoon.height;
        raccoon.draw();
    }
    
    function gameOver() {
        gameActive = false;
        
        // Update button text and icon
        document.getElementById('game-button-text').textContent = 'Try Again';
        
        // Show reset icon instead of try again icon, hide play icon
        document.querySelector('.play-icon').classList.add('hidden');
        document.querySelector('.try-again-icon').classList.add('hidden');
        document.querySelector('.reset-icon').classList.remove('hidden');
        
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
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
    
    // Game rendering
    function drawBackground() {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Draw background cityscape with parallax
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(148, 163, 184, 0.3)'; // Brighter in dark mode
        
        // Create a more randomized cityscape that spawns from the right
        // Significantly reduce the speed to create distant background effect
        const baseSpeed = 0.15;
        const scrollSpeed = gameSpeed * baseSpeed;
        
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
            ctx.fillRect(building.x, groundLevel - building.height, building.width, building.height);
            
            // Add windows to buildings with better visibility in dark mode
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(51, 65, 85, 0.2)';
            
            // Draw windows
            const windowSize = 6;
            const windowMargin = 10;
            
            building.windows.forEach(window => {
                const windowX = building.x + (window.col + 1) * (building.width / (Math.floor(building.width / 15) + 1)) - windowSize/2;
                const windowY = groundLevel - building.height + windowMargin + window.row * windowMargin;
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
        ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);
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
        if (timestamp - lastObstacleTime > obstacleInterval) {
            obstacles.push(new Obstacle());
            lastObstacleTime = timestamp;
            
            // Randomize next obstacle timing based on difficulty
            const variability = 400 - (difficultyLevel * 20);
            obstacleInterval = Math.max(
                MIN_OBSTACLE_INTERVAL,
                obstacleInterval - (difficultyLevel * 10) + (Math.random() * variability)
            );
        }
        
        // Update and draw obstacles, removing those that are off screen
        obstacles = obstacles.filter(obstacle => {
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
        if (gameActive) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    // Initialize the game
    resizeCanvas();
    resetGame();
}

// Resume Generator
function initResumeDownload() {
    const downloadButton = document.getElementById('download-resume');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', generateResume);
    
    // We no longer need to add the designer-mode-active class
    // as we're using consistent styling for all action buttons
}

function generateResume() {
    // Show loading state
    const downloadButton = document.getElementById('download-resume');
    const originalButtonContent = downloadButton.innerHTML;
    
    // Set button to loading state
    downloadButton.innerHTML = `
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
    `;
    downloadButton.disabled = true;

    // Check if libraries are loaded
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        console.error('jsPDF library not loaded properly');
        downloadButton.innerHTML = originalButtonContent;
        downloadButton.disabled = false;
        alert('PDF generation library not loaded. Please refresh the page and try again.');
        return;
    }

    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library not loaded properly');
        downloadButton.innerHTML = originalButtonContent;
        downloadButton.disabled = false;
        alert('PDF generation library not loaded. Please refresh the page and try again.');
        return;
    }

    try {
        // Create a hidden div to build the resume
        const resumeContainer = document.createElement('div');
        resumeContainer.id = 'resume-container';
        resumeContainer.style.position = 'absolute';
        resumeContainer.style.left = '-9999px';
        resumeContainer.style.width = '750px'; // Slightly reduced width
        resumeContainer.style.backgroundColor = '#ffffff'; // Ensure white background
        resumeContainer.style.fontFamily = "'Inter', sans-serif"; // Set font directly
        document.body.appendChild(resumeContainer);

        // Get data from the website
        const name = document.querySelector('header h1').textContent.trim();
        const title = document.querySelector('header p').textContent.trim();
        
        // Get contact info including phone, email, website and location
        const contactLinks = [];
        
        // Phone - get from hidden element
        const phoneElement = document.getElementById('phone-for-pdf');
        if (phoneElement) {
            contactLinks.push({
                text: phoneElement.textContent.trim(),
                href: phoneElement.getAttribute('href'),
                type: 'phone'
            });
        }
        
        // Email
        const emailElement = document.querySelector('a[href^="mailto:"]');
        if (emailElement) {
            contactLinks.push({
                text: emailElement.textContent.trim(),
                href: emailElement.getAttribute('href'),
                type: 'email'
            });
        }
        
        // Website - get from hidden element
        const websiteElement = document.getElementById('website-for-pdf');
        if (websiteElement) {
            contactLinks.push({
                text: websiteElement.textContent.trim(),
                href: websiteElement.getAttribute('href'),
                type: 'website'
            });
        }
        
        // Location - set directly 
        const locationText = "Los Angeles, CA";
        
        // Get experience items - include all jobs
        const experienceItems = Array.from(document.querySelectorAll('#experience .space-y-8 > div'))
            .map(item => {
                const title = item.querySelector('h3')?.textContent.trim() || '';
                const companyElement = item.querySelector('h3 + div');
                const company = companyElement ? companyElement.textContent.trim() : '';
                const durationElement = item.querySelector('.whitespace-nowrap');
                const duration = durationElement ? durationElement.textContent.trim() : '';
                return { title, company, duration };
            }).filter(item => item.title && item.company); // Filter out any incomplete items

        // Build the resume HTML with grayscale styling and contacts in header
        resumeContainer.innerHTML = `
            <div style="color:#333333;padding:30px;box-sizing:border-box;background-color:#fff;">
                <!-- Header with integrated contact info -->
                <div style="margin-bottom:25px;border-bottom:1px solid #666666;padding-bottom:15px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                        <div>
                            <h1 style="font-size:24px;margin:0 0 4px 0;color:#333333;">${name}</h1>
                            <p style="font-size:16px;margin:0 0 8px 0;color:#555555;">${title}</p>
                            <p style="font-size:13px;margin:0;color:#666666;">${locationText}</p>
                        </div>
                        <div style="text-align:right;">
                            ${contactLinks.map(link => `
                                <div style="margin-bottom:4px;">
                                    ${link.href 
                                        ? `<a href="${link.href}" style="color:#555555;text-decoration:none;font-size:13px;">${link.text}</a>`
                                        : `<span style="color:#555555;font-size:13px;">${link.text}</span>`
                                    }
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Professional Experience (full width) - now first section -->
                <div>
                    <h2 style="font-size:16px;margin:0 0 10px 0;color:#444444;">Professional Experience</h2>
                    <div style="border-top:1px solid #dddddd;padding-top:10px;">
                        ${experienceItems.map(exp => `
                            <div style="margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eeeeee;">
                                <h3 style="font-size:14px;margin:0 0 3px 0;color:#333333;">${exp.title}</h3>
                                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                    <p style="margin:0;color:#555555;font-weight:500;font-size:12px;">${exp.company}</p>
                                    <p style="margin:0;color:#666666;font-size:11px;">${exp.duration}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Use html2canvas and jsPDF to generate the PDF
        setTimeout(() => {
            html2canvas(resumeContainer, {
                scale: 1.5, // Reduced scale for smaller file size while maintaining readability
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                imageTimeout: 0, // No timeout for image loading
                onclone: function(clonedDoc) {
                    // Optimize any images in the cloned document if needed
                    const images = clonedDoc.querySelectorAll('img');
                    images.forEach(img => {
                        img.style.imageRendering = 'optimizeSpeed';
                    });
                }
            }).then(canvas => {
                try {
                    // Optimize the canvas image quality for smaller file size
                    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality instead of PNG
                    
                    // Create PDF document with compression
                    const pdf = new jspdf.jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                        compress: true // Enable compression
                    });
                    
                    // Calculate dimensions
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                    const imgX = (pdfWidth - imgWidth * ratio) / 2;
                    const imgY = 0;
                    
                    // Add image to PDF with compression
                    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');
                    
                    // Set PDF metadata with minimal info to reduce size
                    pdf.setProperties({
                        title: 'Jeremy Venegas Resume',
                        subject: 'Resume',
                        creator: 'Resume Generator'
                    });
                    
                    // Optimize PDF for web viewing
                    pdf.setLanguage('en-US');
                    
                    // Save the PDF with compression
                    const pdfOutput = pdf.output('arraybuffer');
                    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Jeremy_Venegas_Resume.pdf';
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    // Clean up
                    document.body.removeChild(resumeContainer);
                    downloadButton.innerHTML = originalButtonContent;
                    downloadButton.disabled = false;
                } catch (err) {
                    console.error('Error creating PDF:', err);
                    downloadButton.innerHTML = originalButtonContent;
                    downloadButton.disabled = false;
                    alert('There was an error creating your resume PDF. Please try again.');
                }
            }).catch(err => {
                console.error('Error generating canvas:', err);
                downloadButton.innerHTML = originalButtonContent;
                downloadButton.disabled = false;
                alert('There was an error generating your resume. Please try again.');
            });
        }, 500);
    } catch (error) {
        console.error('Error preparing resume data:', error);
        downloadButton.innerHTML = originalButtonContent;
        downloadButton.disabled = false;
        alert('There was an error preparing your resume data. Please try again.');
    }
}