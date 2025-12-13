// Game Configuration
const CONFIG = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    playerSpeed: 5,
    enemyBaseSpeed: 0.5,
    enemySpeedMultiplier: 1.0,
    spawnRate: 2000, // milliseconds
    maxEnemies: 5,
    lives: 3,
    score: 0,
    wave: 1,
    gameState: 'start', // 'start', 'playing', 'gameover'
    lastSpawn: 0,
    activeEnemy: null,
    typedText: '',
    stars: []
};

// Game Objects
const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 30,
    color: '#4a90e2'
};

const enemies = [];
const explosions = [];
const particles = [];

// Initialize game
function init() {
    CONFIG.canvas = document.getElementById('gameCanvas');
    CONFIG.ctx = CONFIG.canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize player position
    player.x = CONFIG.width / 2 - player.width / 2;
    player.y = CONFIG.height - player.height - 20;
    
    // Create stars background
    createStars();
    
    // Load high score
    loadHighScore();
    
    // Event listeners
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
    
    // Start game loop
    gameLoop();
}

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const maxHeight = Math.min(600, window.innerHeight - 40);
    
    CONFIG.width = maxWidth;
    CONFIG.height = maxHeight;
    
    CONFIG.canvas.width = CONFIG.width;
    CONFIG.canvas.height = CONFIG.height;
    
    // Update player position
    player.x = CONFIG.width / 2 - player.width / 2;
    player.y = CONFIG.height - player.height - 20;
}

function createStars() {
    CONFIG.stars = [];
    for (let i = 0; i < 100; i++) {
        CONFIG.stars.push({
            x: Math.random() * CONFIG.width,
            y: Math.random() * CONFIG.height,
            size: Math.random() * 2,
            speed: 0.5 + Math.random() * 1.5
        });
    }
}

const bgMusic = document.getElementById('bgMusic');

function startAudio() {
    bgMusic.volume = 0.4;
    bgMusic.play();
}

document.addEventListener('keydown', startAudio, { once: true });


function startGame() {
    // Reset game state
    CONFIG.gameState = 'playing';
    CONFIG.score = 0;
    CONFIG.wave = 1;
    CONFIG.lives = 3;
    CONFIG.enemySpeedMultiplier = 1.0;
    CONFIG.spawnRate = 2000;
    CONFIG.maxEnemies = 5;
    CONFIG.typedText = '';
    CONFIG.activeEnemy = null;
    
    enemies.length = 0;
    explosions.length = 0;
    particles.length = 0;
    
    // Hide screens
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gameUI').classList.remove('hidden');
    
    // Update UI
    updateUI();
    
    // Focus canvas for keyboard input
    CONFIG.canvas.focus();
}

function gameOver() {
    CONFIG.gameState = 'gameover';
    
    // Check for new high score
    const highScore = getHighScore();
    const isNewHighScore = CONFIG.score > highScore;
    
    if (isNewHighScore) {
        saveHighScore(CONFIG.score);
        document.getElementById('newHighScore').classList.remove('hidden');
    } else {
        document.getElementById('newHighScore').classList.add('hidden');
    }
    
    // Show game over screen
    document.getElementById('finalScore').textContent = `Final Score: ${CONFIG.score}`;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('gameUI').classList.add('hidden');
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (CONFIG.gameState !== 'playing') return;
    
    const now = Date.now();
    
    // Update stars
    CONFIG.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > CONFIG.height) {
            star.y = 0;
            star.x = Math.random() * CONFIG.width;
        }
    });
    
    // Spawn enemies
    if (now - CONFIG.lastSpawn > CONFIG.spawnRate && enemies.length < CONFIG.maxEnemies) {
        spawnEnemy();
        CONFIG.lastSpawn = now;
    }
    
    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        
        // Check if enemy reached bottom
        if (enemy.y > CONFIG.height) {
            enemies.splice(index, 1);
            CONFIG.lives--;
            if (CONFIG.activeEnemy === enemy) {
                CONFIG.activeEnemy = null;
                CONFIG.typedText = '';
            }
            
            if (CONFIG.lives <= 0) {
                gameOver();
            }
            updateUI();
        }
    });
    
    // Update explosions
    explosions.forEach((explosion, index) => {
        explosion.life--;
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
    
    // Update particles
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
    
    // Set active enemy (closest to bottom)
    if (enemies.length > 0 && !CONFIG.activeEnemy) {
        CONFIG.activeEnemy = enemies.reduce((closest, enemy) => {
            return enemy.y > closest.y ? enemy : closest;
        });
    }
    
    // Update wave
    const newWave = Math.floor(CONFIG.score / 500) + 1;
    if (newWave > CONFIG.wave) {
        CONFIG.wave = newWave;
        CONFIG.enemySpeedMultiplier += 0.2;
        CONFIG.spawnRate = Math.max(800, CONFIG.spawnRate - 100);
        CONFIG.maxEnemies = Math.min(10, CONFIG.maxEnemies + 1);
        updateUI();
    }
    
    updateUI();
}

function spawnEnemy() {
    const difficulty = CONFIG.wave;
    const word = getRandomWord(difficulty);
    const speed = CONFIG.enemyBaseSpeed * CONFIG.enemySpeedMultiplier;
    
    enemies.push({
        x: Math.random() * (CONFIG.width - 60),
        y: -40,
        width: 50,
        height: 30,
        word: word,
        typed: '',
        speed: speed,
        color: getEnemyColor(difficulty)
    });
}

function getEnemyColor(difficulty) {
    if (difficulty <= 2) return '#ff6b6b';
    if (difficulty <= 4) return '#ffa500';
    if (difficulty <= 6) return '#ff1493';
    return '#8b00ff';
}

function handleKeyPress(event) {
    if (CONFIG.gameState !== 'playing') return;
    
    // Ignore special keys
    if (event.key.length > 1 && event.key !== 'Backspace') return;
    
    if (event.key === 'Backspace') {
        if (CONFIG.typedText.length > 0) {
            CONFIG.typedText = CONFIG.typedText.slice(0, -1);
            if (CONFIG.activeEnemy) {
                CONFIG.activeEnemy.typed = CONFIG.typedText;
            }
        }
        return;
    }
    
    if (!CONFIG.activeEnemy) return;
    
    const char = event.key.toLowerCase();
    const expectedChar = CONFIG.activeEnemy.word[CONFIG.typedText.length].toLowerCase();
    
    if (char === expectedChar) {
        CONFIG.typedText += char;
        CONFIG.activeEnemy.typed = CONFIG.typedText;
        
        // Check if word is complete
        if (CONFIG.typedText.toLowerCase() === CONFIG.activeEnemy.word.toLowerCase()) {
            destroyEnemy(CONFIG.activeEnemy);
        }
    } else {
        // Wrong character - reset typing
        CONFIG.typedText = '';
        if (CONFIG.activeEnemy) {
            CONFIG.activeEnemy.typed = '';
        }
    }
    
    updateActiveWordDisplay();
}

function destroyEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
        
        // Create explosion
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        
        // Update score
        CONFIG.score += enemy.word.length * 10 * CONFIG.wave;
        
        // Reset typing
        CONFIG.typedText = '';
        CONFIG.activeEnemy = null;
        
        updateUI();
    }
}

function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 40,
        life: 20,
        color: '#ffd700'
    });
    
    // Create particles
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            color: ['#ffd700', '#ff6b6b', '#4a90e2'][Math.floor(Math.random() * 3)]
        });
    }
}

function render() {
    const ctx = CONFIG.ctx;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    
    // Draw stars
    ctx.fillStyle = '#fff';
    CONFIG.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    if (CONFIG.gameState !== 'playing') return;
    
    // Draw player ship
    drawShip(player.x, player.y, player.width, player.height, player.color, true);
    
    // Draw enemies
    enemies.forEach(enemy => {
        drawShip(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color, false);
        
        // Draw word above enemy
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        const word = enemy.word;
        const typed = enemy.typed || '';
        const remaining = word.slice(typed.length);
        
        // Draw typed portion in blue
        if (typed.length > 0) {
            ctx.fillStyle = '#4a90e2';
            ctx.fillText(typed, enemy.x + enemy.width / 2, enemy.y - 5);
        }
        
        // Draw remaining portion in white
        if (remaining.length > 0) {
            ctx.fillStyle = '#fff';
            const typedWidth = ctx.measureText(typed).width;
            ctx.fillText(remaining, enemy.x + enemy.width / 2 + typedWidth / 2, enemy.y - 5);
        }
    });
    
    // Draw explosions
    explosions.forEach(explosion => {
        const progress = 1 - (explosion.life / explosion.maxRadius);
        explosion.radius = explosion.maxRadius * progress;
        
        ctx.fillStyle = explosion.color;
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
    
    // Draw particles
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.fillRect(particle.x, particle.y, 3, 3);
        ctx.globalAlpha = 1;
    });
}

function drawShip(x, y, width, height, color, isPlayer) {
    const ctx = CONFIG.ctx;
    ctx.fillStyle = color;
    
    if (isPlayer) {
        // Draw player ship (triangle pointing up)
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        // Draw enemy ship (triangle pointing down)
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + height);
        ctx.lineTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function updateUI() {
    document.getElementById('scoreDisplay').textContent = CONFIG.score;
    document.getElementById('waveDisplay').textContent = CONFIG.wave;
    document.getElementById('livesDisplay').textContent = CONFIG.lives;
    updateActiveWordDisplay();
}

function updateActiveWordDisplay() {
    const activeWordEl = document.getElementById('activeWord');
    
    if (!CONFIG.activeEnemy) {
        activeWordEl.innerHTML = '<span style="color: #666;">No active target</span>';
        return;
    }
    
    const word = CONFIG.activeEnemy.word;
    const typed = CONFIG.typedText || '';
    const remaining = word.slice(typed.length);
    
    let html = '';
    if (typed.length > 0) {
        html += `<span class="typed">${typed}</span>`;
    }
    if (remaining.length > 0) {
        html += `<span class="remaining">${remaining}</span>`;
    }
    
    activeWordEl.innerHTML = html || word;
}

// High Score Management
function getHighScore() {
    return parseInt(localStorage.getItem('typeBlasterHighScore') || '0');
}

function saveHighScore(score) {
    localStorage.setItem('typeBlasterHighScore', score.toString());
}

function loadHighScore() {
    const highScore = getHighScore();
    if (highScore > 0) {
        document.getElementById('highScoreDisplay').textContent = `High Score: ${highScore}`;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


