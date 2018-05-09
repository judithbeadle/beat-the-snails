// Enemy Class
class Enemy {
    constructor(x = 200, y = 200) {
        this.x = 0; // initial x TODO: set at different distances from left edge (negative value)
        this.y = 83; // initial y TODO: - Mathrandom * row height
        this.sprite = 'images/enemy-bug.png'; // image
        console.log('enemy is at '+ this.x + this.y);
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x = (this.x + 1) * dt;
    };
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};



// Player Class
class Player {
    constructor(x = 200, y = 200) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
        console.log('player is at '+ this.x + this.y);
    }

    update() {
        this.x++;
        this.y++;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(){
        this.update();
    }
}


// Now instantiate your objects.
const enemy = new Enemy;
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
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
