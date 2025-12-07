// Word lists for different difficulty levels
const WORD_LISTS = {
    easy: [
        'cat', 'dog', 'sun', 'moon', 'star', 'car', 'bus', 'hat', 'cup', 'pen',
        'run', 'jump', 'walk', 'play', 'read', 'book', 'tree', 'bird', 'fish', 'cake',
        'ball', 'toy', 'game', 'home', 'door', 'wall', 'desk', 'chair', 'table', 'lamp'
    ],
    medium: [
        'planet', 'rocket', 'laser', 'shield', 'energy', 'power', 'speed', 'attack', 'defend', 'victory',
        'battle', 'combat', 'weapon', 'target', 'missile', 'engine', 'thrust', 'orbit', 'galaxy', 'nebula',
        'asteroid', 'comet', 'meteor', 'cosmos', 'stellar', 'quantum', 'photon', 'plasma', 'fusion', 'gravity'
    ],
    hard: [
        'spaceship', 'constellation', 'supernova', 'blackhole', 'quasar', 'pulsar', 'interstellar', 'extraterrestrial',
        'astronaut', 'cosmonaut', 'satellite', 'telescope', 'observatory', 'laboratory', 'experiment', 'hypothesis',
        'electromagnetic', 'thermodynamics', 'astrophysics', 'cosmology', 'exoplanet', 'atmosphere', 'stratosphere', 'ionosphere'
    ],
    veryHard: [
        'intergalactic', 'electromagnetic', 'thermodynamics', 'astrophysics', 'cosmological', 'extraterrestrial',
        'superluminal', 'gravitational', 'quantummechanics', 'electrodynamics', 'spectroscopy', 'photometry',
        'astronomical', 'phenomenological', 'methodological', 'technological', 'revolutionary', 'evolutionary'
    ]
};

// Get a random word based on difficulty level
function getRandomWord(difficulty = 'easy') {
    const wordPool = [];
    
    // Always include easy words
    wordPool.push(...WORD_LISTS.easy);
    
    // Add medium words from wave 2+
    if (difficulty >= 2) {
        wordPool.push(...WORD_LISTS.medium);
    }
    
    // Add hard words from wave 4+
    if (difficulty >= 4) {
        wordPool.push(...WORD_LISTS.hard);
    }
    
    // Add very hard words from wave 6+
    if (difficulty >= 6) {
        wordPool.push(...WORD_LISTS.veryHard);
    }
    
    return wordPool[Math.floor(Math.random() * wordPool.length)];
}

