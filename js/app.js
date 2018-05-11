/* Global values and functions
==================== */

const canvasWidth = 500;
const tileWidth = 100; // for offsetting enemies and moving player
const tileHeight = 80; // for offsetting enemies and moving player
// offsets for pngs
const entityOffesetY = tileHeight - 60, entityOffesetX = tileWidth/2;

// Random number function for enemy start offsets and speed
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/* Classes 
===================== */

// Enemy Class
class Enemy {
    constructor(x, row, col, speed = 1) {
        this.x = x;
        this.row = row;
        this.col = col;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png'; // image
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // set random speed
        this.x = this.x + this.speed
        // reposition the enemy and assign new random speed once it's gone of the canvas
        if (this.x > canvasWidth){
            this.x = (getRandomInt(canvasWidth/2) * (-1)) - tileWidth;
            this.speed = 0.5//getRandomInt(2) + 1;
        }
        if (this.x + tileWidth - 20 > 0 && this.x < canvasWidth - tileWidth){
            this.col = Math.floor(((this.x - 20)/tileWidth) + 2);
            console.log('col: ' + this.col + ' in row ' + this.row);
        }
    };
    
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

   
};

// Player Class
class Player {
    constructor(col = 3, row = 4) {
        this.col = col;
        this.row = row;
        this.x = (col * tileWidth) - tileWidth; 
        this.y = (row * tileHeight) + tileHeight;
        this.sprite = 'images/char-boy.png'; // image
        console.log(this.sprite + ' player is at col '+ this.col + ' row ' + this.row);
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col * tileWidth) - tileWidth, this.row * tileHeight);
    };
    // Move player when arrow keys are pressed
    handleInput(keyPressed){
        switch (keyPressed) {
        case 'left':
            if (player.col > 1) {
                player.col -= 1;
                // player.x -= tileWidth;
                console.log('player is at col '+ player.col + ' row ' + player.row);
            }
            break;
        case 'right':
            if (player.col < 5) {
                player.col += 1;
                console.log('player is at col '+ player.col + ' row ' + player.row);
            }
            break;
        case 'up':
            if (player.row > 1) {
                player.row -= 1;
                console.log('player is at col '+ player.col + ' row ' + player.row);
            } else {
                // arrived at top, reset to bottom
                player.col = 3
                player.row = 4;
                console.log('player is at col '+ player.col + ' row ' + player.row);
            }
            break;
        case 'down':
            if (player.row < 5) {
                player.row += 1;
                console.log('player is at col '+ player.col + ' row ' + player.row);
            }
            break;
        }
    }
    // 
};


/* Initiations 
====================== */

// Enemy initiation
let enemy = new Enemy;
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
// creating the enemies and putting them in the array
for (var i = 0; i < 1; i++) {
    enemy = new Enemy;
    //position enemy
    enemy.x = getRandomInt(canvasWidth/2) * (-1) - tileWidth;
    enemy.y = (i + 1) * tileHeight - entityOffesetY;
    enemy.speed = 0.5//getRandomInt(2) + 1;
    allEnemies.push(enemy);
    enemy.row = i + 1;
    console.log('this enemy starts at ' + enemy.x + '/' + enemy.y);
}

// Player initiation
const player = new Player;

/* Collision detection 
====================== */

// if anything is on the same tile as anything else we have a collision
// set this up broad, so we can also use it to detect collection of things later




/* Input Handling
====================== */

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
