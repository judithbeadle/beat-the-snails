/* Global values and functions
==================== */

const canvasWidth = 1000;
const tileWidth = 200; // for offsetting enemies and moving player
const tileHeight = 160; // for offsetting enemies and moving player
// offsets for pngs
const entityOffesetY = 60, entityOffesetX = tileWidth/2;
// const scoreboardContainer = document.createElement('div');

let gameOver = false;


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
        checkFruitTaken();
    }; 
};

// Player Class
class Player {
    constructor(col = 3, row = 4, lives = 3, hit = false) {
        this.col = col;
        this.row = row;
        this.x = (col * tileWidth) - tileWidth; 
        this.y = (row * tileHeight) + tileHeight;
        this.sprite = 'images/redhead.png'; // image
        this.lives = lives;
        // make this work with timeout function
        this.hit = hit;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col * tileWidth) - tileWidth, this.row * tileHeight - entityOffesetY+10);
        checkCollision();
        checkFruitTaken();
    };
    
    // Move player when arrow keys are pressed
    handleInput(keyPressed){
        if (gameOver === true){
            return;
        }
        switch (keyPressed) {
        case 'left':
            if (this.col > 1) {
                this.col -= 1;
            }
            break;
        case 'right':
            if (this.col < 5) {
                this.col += 1;
            }
            break;
        case 'up':
            if (this.row > 1) {
                this.row -= 1;
            } else {
                levelUp();
                this.col = 3;
                this.row = 4;
            }
            break;
        case 'down':
            if (this.row < 5) {
                this.row += 1;
            }
            break;
        }
    }
};

// Fruit Class
class Fruit {
    constructor(row, col, eaten = false, picked = false) {
        this.row = row;
        this.col = col;
        this.sprite = 'images/strawberry.png';
        // you can only eat or pick each fruit once - make this work with timeout function
        this.eaten = eaten;
        this.picked = picked;
    }
    // Draw the strawberry on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col-1) * tileWidth, this.row * tileHeight - entityOffesetY);
    }; 
    getsEeaten(){
        this.eaten = true;
        this.sprite = 'images/strawberry-eaten.png';
        let fruitIndex = allFruit.indexOf(this);
        if (fruitIndex > -1) {
            setTimeout(function() {
                allFruit.splice(fruitIndex, 1);
            }, 500);
            console.log(allFruit);
        }
    }
    getsPicked(){
        this.picked = true;
        let fruitIndex = allFruit.indexOf(this);
        if (fruitIndex > -1) {
            allFruit.splice(fruitIndex, 1);
            console.log(allFruit);
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
// fruit initiation
let fruit = new Fruit;
// Place all fruit objects in an array called allFruit
let allFruit = [];
// array for picked fruit
let pickedFruit = [];
const pickedFruitDisplay = document.createElement('ul');
const oneFruit = "<li class = 'strawberry'></li>";
const basketFruit = "<li class = 'strawberry temp'></li>";
// array for fruit eaten by snails!
let eatenFruit = [];
const eatenFruitDisplay = document.createElement('ul');
// array for collected fruit
let collectedFruit = [];

let liveIcons = [ , , ];


function updateInfo(){
    pickedFruitDisplay.innerHTML = basketFruit.repeat(pickedFruit.length) + oneFruit.repeat(collectedFruit.length);
    eatenFruitDisplay.innerHTML = oneFruit.repeat(eatenFruit.length);
}

function displayInfo(){
    scoreboard.appendChild(pickedFruitDisplay);
    scoreboard.appendChild(eatenFruitDisplay);
    pickedFruitDisplay.setAttribute('class', 'pickedFruit');
    eatenFruitDisplay.setAttribute('class', 'eatenFruit');
    updateInfo();
    //scoreboard.innerHTML = `Lives: ${player.lives}, Level: ${gameLevel}, Number of Enemies: ${allEnemies.length} <br>Fruit in Basket: ${pickedFruit.length}<br><b>Snails: ${eatenFruit.length} You: ${collectedFruit.length}</b>`;
}


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
    }
}

// creating the fruit and putting them in the array
function createFruit(numFruit = 3){
    for (var i = 0; i < numFruit; i++) {
        fruit = new Fruit;
        //position enemy
        // avoid having fruit in first col
        fruit.col = getRandomInt(4) + 2;
        fruit.row = i + 1;
        allFruit.push(fruit);
        console.log('strawberrys: ' + allFruit.length);
    }
}

// initiation
createFruit();
createEnemies();

// Player initiation
const player = new Player;

function levelUp(){
    collectedFruit = collectedFruit.concat(pickedFruit);
    pickedFruit = [];
    allFruit = [];
    createFruit();

    if (gameLevel === 3){
        endGame('won');
        // remove keyevents
        // display points and Message
        // stuff collected 
        // time bonus
        // total
        displayInfo();
    } else {
        gameLevel ++;
        createEnemies(1);
        displayInfo();
    }
    
}




/* Game Over
====================== */

function endGame(result){
    switch(result){
        case 'won': 
            console.log('you won');
            break;
        case 'lost':
            console.log('you lost :(');
            break;
    }
    
    gameOver = true;
    allEnemies = [];
}

/* Collision detection 
====================== */

function checkCollision(){
    
    // getting a new array with enemies in same row and on canvas
    let enemiesInRow = allEnemies.filter(enemy => enemy.onCanvas === true && enemy.row === player.row);
    // checking if there are any on same col
    if (enemiesInRow.length > 0 && enemiesInRow.filter(enemy => enemy.col === player.col).length > 0) {
        if(player.lives === 0){
            endGame('lost');
        } else {
            if (player.hit === true){
                return;
            }
            player.lives -= 1;
            player.hit = true;
            pickedFruit = [];
            allFruit =[];
            displayInfo();
            player.sprite = 'images/redhead-hit.png';
            setTimeout(function() { 
                player.col = 3;
                player.row = 4;
                player.sprite = 'images/redhead.png';
                player.hit = false;
                createFruit();
            }, 500);
      }
    }
}

function checkFruitTaken(){
    allFruit.forEach(function (fruit, index) {
        let enemyOnTile = allEnemies.filter(enemy => enemy.row === fruit.row && enemy.col === fruit.col);
        //let playerOnTile = false;
        if (player.row === fruit.row && player.col === fruit.col){
            if (fruit.picked === true){
                return;
            } else {
                console.log('player is picking fruit');
                fruit.getsPicked();
                pickedFruit.push(fruit);
                updateInfo();
            }
        };
        if (enemyOnTile.length > 0){
            if (fruit.eaten === true){
                return;
            } else {
                
                fruit.getsEeaten();
                eatenFruit.push(fruit);
                displayInfo();
            }
        }
    }); 
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
