// some global values 

const canvasWidth = 505;
const tileWidth = 101; // for offsetting bugs and moving player
const tileHeight = 83;

// getting a random number function for canvas offsets and speed
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Enemy Class
class Enemy {
    constructor(x, y, speed = 1) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png'; // image
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x = this.x + this.speed//= (this.x + 1) * dt;
        if (this.x > canvasWidth){
            this.x = (getRandomInt(400) * (-1)) - tileWidth;
            this.speed = getRandomInt(2) + 1;
        }
    };
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //console.log('enemy rendered' + this.y);
    };
};


// Player Class
class Player {
    constructor(x = 200, y = 380) {
        this.x = x; 
        this.y = y;
        this.sprite = 'images/char-boy.png'; // image
        console.log(this.sprite + ' player is at '+ this.x + this.y);
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    handleInput(keyPressed){
        switch (keyPressed) {
        case 'left':
            if (player.x >= 50) {
                player.x -= 100;
            }
            break;
        case 'right':
            if (player.x <= 300) {
                player.x += 100;
            }
            break;
        case 'up':
            if (player.y > 0) {
                player.y -= 80;
            } else {
                player.score += 100;
                player.y = 380;
                player.x = 200;
            }

            break;
        case 'down':
            if (this.y <= 300) {
                this.y += 80;
            }

            break;

        }
    }
};





// Now instantiate your objects.
let enemy = new Enemy;
// Place all enemy objects in an array called allEnemies
let allEnemies = [];

for (var i = 0; i < 3; i++) {
    enemy = new Enemy;
    //position enemy
    enemy.x = getRandomInt(400) * (-1) - tileWidth;
    enemy.y = (i + 1) * tileHeight  - 25;
    enemy.speed = getRandomInt(2) + 1;
    allEnemies.push(enemy);
    console.log('this enemy starts at ' + enemy.x + '/' + enemy.y);
}




// Place the player object in a variable called player
const player = new Player;


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
