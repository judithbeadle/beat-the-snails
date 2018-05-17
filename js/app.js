/* Global values and functions
==================== */

const canvasWidth = 500;
const tileWidth = 100; // for offsetting enemies and moving player
const tileHeight = 80; // for offsetting enemies and moving player
// offsets for pngs
const entityOffesetY = tileHeight - 50, entityOffesetX = tileWidth/2;


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
        this.onCanvas = false;
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // set random speed
        this.x = this.x + this.speed
        // reposition the enemy and assign new random speed once it's gone off the canvas
        if (this.x > canvasWidth){
            this.x = (getRandomInt(100) * (-1)) - tileWidth;
            this.speed = this.speed + (getRandomInt(5)/10) - (getRandomInt(5)/10);
            this.onCanvas = false;
        }
        if (this.x + tileWidth - 20 > 0 && this.x < canvasWidth - tileWidth){
            this.col = Math.floor(((this.x - 20)/tileWidth) + 2);
            this.onCanvas = true;
            //console.log(this.speed);
        }
    };
    
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.row * tileHeight - entityOffesetY);
    };

   
};

// Player Class
class Player {
    constructor(col = 3, row = 4, lives = 3) {
        this.col = col;
        this.row = row;
        this.x = (col * tileWidth) - tileWidth; 
        this.y = (row * tileHeight) + tileHeight;
        this.sprite = 'images/char-boy.png'; // image
        this.lives = lives;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col * tileWidth) - tileWidth, this.row * tileHeight - entityOffesetY/2);
        checkCollision();
    };
    
    // Move player when arrow keys are pressed
    handleInput(keyPressed){
        if (player.lives === 0){
            return;
        }
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
                levelUp();
                player.col = 3;
                player.row = 4;
                console.log('Gamelevel: ' + gameLevel );
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
};



/* Initiations 
====================== */

let gameLevel = 1;
// Enemy initiation
let enemy = new Enemy;
// Place all enemy objects in an array called allEnemies
let allEnemies = [];

// creating the enemies and putting them in the array
function createEnemies(numEnemies = 3){
        for (var i = 0; i < numEnemies; i++) {
        enemy = new Enemy;
        //position enemy
        enemy.x = getRandomInt(canvasWidth/2) * (-1) - tileWidth;
        if (i > 2) {
            enemy.row = getRandomInt(3) + 1;
        }
        else {
            enemy.row = i + 1;
        }
        enemy.y = (enemy.row + 1) * tileHeight - entityOffesetY;
        enemy.speed = 1 + (getRandomInt(5)/10) - (getRandomInt(5)/10) + gameLevel/10;
        allEnemies.push(enemy);
        console.log(allEnemies.length);
    }
}

createEnemies();

function levelUp(){
    if (gameLevel === 3){
        console.log('Game Over');
        // remove keyevents
        // display points and Message
        // stuff collected 
        // time bonus
        // total
    } else {
        gameLevel ++;
        createEnemies(1);
    }
    
}

// Player initiation
const player = new Player;


/* Game Over
====================== */

function stopGame(){
    allEnemies = [];
    player.handleInput();
    //document.removeEventListener();
}

function gameOver(){
    console.log('game over!');
    stopGame();
}

/* Collision detection 
====================== */

function checkCollision(){
    // getting a new array with enemies in same row and on canvas
    let enemiesInRow = allEnemies.filter(enemy => enemy.onCanvas === true && enemy.row === player.row);
    // checking if there are any on same col
    if (enemiesInRow.length > 0 && enemiesInRow.filter(enemy => enemy.col === player.col).length > 0) {
        if(player.lives === 1){
            player.lives -= 1;
            gameOver();
        } else {
            player.sprite = 'images/char-boy-hit.png';
            setTimeout(function() { 
                player.lives -= 1;
                player.col = 3;
                player.row = 4;
                player.sprite = 'images/char-boy.png';
            }, 500);

            console.log(player.lives)
      }
    }
}


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
