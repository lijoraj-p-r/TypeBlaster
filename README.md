<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/87c67cec-5505-43d0-a2a8-cf9d4fe43301" />

# TypeBlaster 🚀

> A fast-paced typing-shooter game built with vanilla JavaScript and HTML5 Canvas. Destroy enemy ships by typing words correctly before they reach the bottom.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Development](#development)
- [Performance](#performance)
- [Browser Compatibility](#browser-compatibility)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

TypeBlaster is a browser-based typing game that combines word recognition with arcade-style gameplay. The game uses HTML5 Canvas for rendering, implements a game loop with `requestAnimationFrame`, and stores high scores using the Web Storage API.

### Core Mechanics

- **Typing System**: Real-time word matching with visual feedback
- **Wave Progression**: Dynamic difficulty scaling based on score
- **Enemy AI**: Spawn rate and speed increase with each wave
- **State Management**: Game state machine (start → playing → gameover)
- **Particle System**: Canvas-based explosion and particle effects

## Features

### Gameplay
- ✅ Dynamic difficulty scaling with wave progression
- ✅ Word complexity increases with each wave
- ✅ Visual feedback for typed letters (blue highlighting)
- ✅ Particle effects and explosion animations
- ✅ Score system with wave-based multipliers
- ✅ Local high score persistence (localStorage)

### Technical
- ✅ Zero dependencies - pure vanilla JavaScript
- ✅ Responsive canvas rendering
- ✅ 60 FPS game loop using `requestAnimationFrame`
- ✅ Event-driven architecture
- ✅ Modular code structure
- ✅ Cross-browser compatibility

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup and canvas element |
| **CSS3** | Styling, animations, and responsive design |
| **JavaScript (ES6+)** | Game logic, state management, and rendering |
| **Canvas API** | 2D graphics rendering |
| **Web Storage API** | High score persistence |
| **requestAnimationFrame** | Smooth 60 FPS game loop |

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or package managers required

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/TypeBlaster.git

# Navigate to project directory
cd TypeBlaster

# Open in browser
# Option 1: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Option 2: Open directly
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Quick Start

1. Open `index.html` in your browser
2. Click "Start Game"
3. Type words displayed on enemy ships
4. Survive as long as possible!

## Project Structure

```
TypeBlaster/
├── assets
│   └──bgTheme 
├── index.html          # Main HTML structure and game container
├── style.css           # Game styles, animations, and responsive design
├── main.js             # Core game logic, rendering, and state management
├── words.js            # Word lists organized by difficulty level
├── AboutDev.html       # Developer information page
├── favicon_io/         # Favicon assets
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── ...
└── README.md           # Project documentation
```

## Architecture

### Game State Machine

```javascript
States: 'start' → 'playing' → 'gameover' → 'start'
```

### Core Components

#### 1. **Game Configuration** (`CONFIG` object)
- Canvas context and dimensions
- Game parameters (speed, spawn rate, difficulty)
- Current game state and score tracking

#### 2. **Game Objects**
- **Player**: Static position at bottom of canvas
- **Enemies**: Array of enemy objects with word targets
- **Explosions**: Particle effects for destroyed enemies
- **Particles**: Visual effects system

#### 3. **Game Loop**
```javascript
function gameLoop() {
    update();      // Update game state
    render();      // Render to canvas
    requestAnimationFrame(gameLoop);
}
```

#### 4. **Input System**
- Keyboard event listeners for typing
- Active enemy selection (closest to bottom)
- Text matching algorithm with visual feedback

### Rendering Pipeline

1. Clear canvas
2. Draw background (stars)
3. Draw player
4. Draw enemies with words
5. Draw particles/explosions
6. Draw UI (score, lives, wave)
7. Request next frame

## API Reference

### Core Functions

#### `init()`
Initializes the game, sets up canvas, event listeners, and initial state.

#### `startGame()`
Resets game state and transitions from 'start' to 'playing'.

#### `update()`
Main game update loop. Handles:
- Enemy spawning
- Enemy movement
- Collision detection
- Wave progression
- Game over conditions

#### `render()`
Renders all game objects to the canvas in the correct order.

#### `handleKeyPress(event)`
Processes keyboard input for typing system:
- Letter keys: Add to typed text
- Backspace: Remove last character
- Enter: Submit word (if implemented)

### Configuration Object

```javascript
const CONFIG = {
    canvas: null,              // Canvas element
    ctx: null,                 // 2D rendering context
    width: 800,                // Canvas width
    height: 600,               // Canvas height
    enemyBaseSpeed: 0.5,       // Base enemy speed (pixels/frame)
    enemySpeedMultiplier: 1.0, // Speed multiplier per wave
    spawnRate: 2000,           // Milliseconds between spawns
    maxEnemies: 5,             // Maximum enemies on screen
    lives: 3,                  // Starting lives
    score: 0,                  // Current score
    wave: 1,                   // Current wave number
    gameState: 'start',        // Current game state
    activeEnemy: null,         // Currently targeted enemy
    typedText: ''              // Current typed input
};
```

## Configuration

### Adjusting Difficulty

Edit constants in `main.js`:

```javascript
// In CONFIG object
enemyBaseSpeed: 0.5,        // Increase for faster enemies
spawnRate: 2000,            // Decrease for more frequent spawns
maxEnemies: 5,              // Increase for more enemies on screen
```

### Customizing Word Lists

Edit `words.js` to add custom words:

```javascript
const wordLists = {
    easy: ['cat', 'dog', 'run'],      // 3-4 letters
    medium: ['hello', 'world'],       // 5-6 letters
    hard: ['challenge', 'difficult'], // 7-9 letters
    veryHard: ['extraordinary']       // 10+ letters
};
```

### Styling Customization

Modify `style.css` for:
- Color schemes
- Font families
- Animation timings
- Responsive breakpoints

## Development

### Code Style

- Use ES6+ features (const/let, arrow functions, template literals)
- Follow camelCase for variables and functions
- Use descriptive variable names
- Comment complex logic

### Adding Features

1. **New Game Mode**: Extend `gameState` and add corresponding render/update logic
2. **Power-ups**: Add new object type to game loop
3. **Sound Effects**: Integrate Web Audio API
4. **Multiplayer**: Add WebSocket support for real-time gameplay

### Debugging

Enable debug mode by adding to `main.js`:

```javascript
const DEBUG = true;

function render() {
    // ... existing render code ...
    
    if (DEBUG) {
        // Draw debug info
        ctx.fillStyle = 'white';
        ctx.fillText(`FPS: ${fps}`, 10, 20);
        ctx.fillText(`Enemies: ${enemies.length}`, 10, 40);
    }
}
```

## Performance

### Optimizations

- **Object Pooling**: Reuse enemy/particle objects instead of creating new ones
- **Dirty Rectangles**: Only redraw changed areas (not implemented)
- **Request Animation Frame**: Ensures smooth 60 FPS rendering
- **Efficient Collision Detection**: Simple bounding box checks

### Performance Metrics

- Target: 60 FPS
- Canvas size: 800x600 (optimized for most displays)
- Memory: Minimal (no external dependencies)

### Known Limitations

- No object pooling (creates new objects each spawn)
- Full canvas redraw every frame
- No Web Workers for heavy computations

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Fully supported |
| Firefox | 55+ | ✅ Fully supported |
| Safari | 12+ | ✅ Fully supported |
| Edge | 79+ | ✅ Fully supported |
| IE 11 | - | ❌ Not supported |

### Required APIs

- Canvas API
- Web Storage API (localStorage)
- requestAnimationFrame
- ES6+ JavaScript features

## Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Save and wait for deployment
5. Access at `https://[username].github.io/[repo-name]/`

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Custom Server

Upload all files to your web server. No build step required.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Ideas

- [ ] Add sound effects and background music
- [ ] Implement power-ups (slow time, clear screen, etc.)
- [ ] Add different enemy types
- [ ] Create mobile touch controls
- [ ] Add leaderboard with backend integration
- [ ] Implement achievements system
- [ ] Add themes/skins
- [ ] Performance optimizations (object pooling)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with vanilla JavaScript (no frameworks)
- Inspired by classic typing games
- Uses HTML5 Canvas for rendering

---

**Made with ❤️ using HTML5, CSS3, and JavaScript**

For questions or issues, please open an [issue](https://github.com/your-username/TypeBlaster/issues) on GitHub.



