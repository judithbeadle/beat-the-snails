/* Global values and functions
==================== */

const canvasWidth = 1000;
const tileWidth = 200; // for calculating movements and columns
const tileHeight = 160; // for calculating movements and rows

// offsets for pngs
const entityOffesetY = tileHeight, entityOffesetX = tileWidth/2;

// a couple of booleans to quickly check state of play in functions
let gameOver = false;
let gameStarted = false;


// arrays and variables for score and level handling

let gameLevel = 1;
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
// Place all fruit objects in an array called allFruit
let allFruit = [];
// array for picked fruit
let pickedFruit = [];
// array for fruit eaten by snails!
let eatenFruit = [];
// array for collected fruit
let collectedFruit = [];


/* variables and nodes for dsiplaying game scores etc
================== */

// string variables for score panel text
let resultHeadline = "";
let resultText = "";
let runsMessage = 'Runs left: ';

// nodes for html display of score
const pickedFruitDisplay = document.createElement('ul');
const oneFruit = "<li class = 'strawberry'></li>";
const basketFruit = "<li class = 'strawberry temp'></li>";
const eatenFruitDisplay = document.createElement('ul');
const runsDisplay = document.createElement('p');
const infoPanel = document.createElement('div');
infoPanel.setAttribute('class', 'resultPanel');

// button for (re)starting game
const startButton = document.createElement('button');
startButton.setAttribute('class', 'start-button');
startButton.innerHTML = "Start the game";

// introduction to the game
const startText = "<h2>Beat the Snails</h2><p>Don’t you just love strawberries?! <br>Well, so do the snails... </p><p class='info-text'>Use the arrow keys on your keyboard to move the player and collect as many strawberries as possible with each run across the garden. But watch out! If one of those greedy snails gets to you, before you reach the other side, you’ll lose the strawberries from the current run. And beware, those snails can get quite fast... </p><p>So, who’s going to have that strawberry feast?</p>";

// resetting html based on updated values
function updateInfo(){
    pickedFruitDisplay.innerHTML = basketFruit.repeat(pickedFruit.length) + oneFruit.repeat(collectedFruit.length);
    eatenFruitDisplay.innerHTML = oneFruit.repeat(eatenFruit.length);
    runsDisplay.innerHTML = runsMessage + ' <span>' + player.runs + '</span>';
    if (gameOver === true){
        scoreboard.appendChild(infoPanel);
        infoPanel.innerHTML = `<h2>${resultHeadline}</h2><p>${resultText}</p>`;
        infoPanel.appendChild(startButton);
        startButton.innerHTML = "play again";
    }
}

// adding created / updated nodes to the DOM
function displayInfo(){
    runsDisplay.innerHTML = runsMessage + ' <span>' + player.runs + '</span>';
    scoreboard.appendChild(pickedFruitDisplay);
    scoreboard.appendChild(eatenFruitDisplay);
    scoreboard.appendChild(runsDisplay);
    
    // adding classes for fruit in basket and fruit added to player score for different styling
    pickedFruitDisplay.setAttribute('class', 'pickedFruit');
    eatenFruitDisplay.setAttribute('class', 'eatenFruit');

    // only display intro panel text first time around
    if (gameStarted === false && gameOver === false){
        scoreboard.appendChild(infoPanel);
        infoPanel.innerHTML = startText;
        infoPanel.appendChild(startButton);
    }
}

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
        this.onCanvas = false; // for checking position on and off canvas
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks

    update(dt) {

        // update position based on speed
        this.x = this.x + this.speed;

        // while the enemy is on canvas, define the column it's on and check for collision and fruit
        if (this.x + tileWidth - 20 > 0 && this.x < canvasWidth - tileWidth){
            this.col = Math.floor(((this.x - 20)/tileWidth) + 2);
            checkFruitTaken();
            checkCollision();
        }

        // reposition the enemy and assign new random speed once it's gone off the canvas
        if (this.x > canvasWidth){
            this.x = (getRandomInt(100) * (-1)) - tileWidth;
            this.speed = this.speed + (getRandomInt(5)/10) - (getRandomInt(5)/10);
        }
    };

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.row * tileHeight - entityOffesetY);   
    }; 
};

// Player Class

class Player {
    constructor(col = 3, row = 4, runs = 6, hit = false) {
        this.col = col;
        this.row = row;
        this.sprite = 'images/redhead.png'; // image
        this.runs = runs;
        // make this work with timeout function
        this.hit = hit;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col * tileWidth) - tileWidth, this.row * tileHeight - entityOffesetY+10);
    };
    
    // Move player when arrow keys are pressed
    handleInput(keyPressed){
        // don't handle input when game is not running or when player is hit
        if (gameStarted === false || player.hit === true){
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
        // only check if fruit is taken when player changes posiion
        checkFruitTaken();
    }
};

// Fruit Class

class Fruit {
    constructor(row, col, eaten = false) {
        this.row = row;
        this.col = col;
        this.sprite = 'images/strawberry.png';
        this.eaten = eaten; // you can only eat each fruit once - helper boolean for time-out function
    }

    // Draw the strawberry on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), (this.col-1) * tileWidth, this.row * tileHeight - entityOffesetY);
    }; 

    // fruit gets eaten, ie. moved to a different array
    getsEeaten(){
        this.sprite = 'images/strawberry-eaten.png';
        this.eaten = true;
        let fruitIndex = allFruit.indexOf(this);
        setTimeout(function() {
            // remove fruit with slight delay for 'animation'
            allFruit.splice(fruitIndex, 1);
            this.eaten = false;
        }, 300);
    }

    // fruit gets picked, ie. moved to a different array
    getsPicked(){
        this.picked = true;
        let fruitIndex = allFruit.indexOf(this);
        if (fruitIndex > -1) {
            allFruit.splice(fruitIndex, 1);
        }
    }
};


/* Initiations 
====================== */

// Enemy initiation
let enemy = new Enemy;

// fruit initiation
let fruit = new Fruit;

// creating the enemies and putting them in the array
function createEnemies(numEnemies = 3){
        for (var i = 0; i < numEnemies; i++) {
        enemy = new Enemy;

        //position enemy
        enemy.x = getRandomInt(canvasWidth/4) * (-1) - tileWidth;
        if (i > 2) {
            enemy.row = getRandomInt(3) + 1;
        }
        else {
            enemy.row = i + 1;
        }
        enemy.y = (enemy.row + 1) * tileHeight - entityOffesetY;
        enemy.speed = 1 + (getRandomInt(5)/15) - (getRandomInt(5)/5) + gameLevel/4;
        allEnemies.push(enemy);
    }
}

// creating the fruit and putting them in the array

function createFruit(){
    if(gameOver === true){
        return;
    }
    // replace fruit taken to make total number 3 again
    numFruit = 3 - allFruit.length;
    for (var i = 0; i < numFruit; i++) {
        fruit = new Fruit;

        // place fruit in random column, avoid having fruit in first col
        fruit.col = getRandomInt(4) + 2;

        // one fruit per row
        fruit.row = i + 1;
        allFruit.push(fruit);
    }
}


/* Game Logic 
====================== */

// collsion detection between player and enemies

function checkCollision(){

    // filtering enemies that are in same row and col as player
    let enemiesOnTile = allEnemies.filter(enemy => enemy.row === player.row && enemy.col === player.col);
    if (enemiesOnTile.length > 0) {
         if (player.hit === true || player.runs < 1){
            return;
        } else {
            player.runs -= 1; // player loses one go/live
            eatenFruit = eatenFruit.concat(pickedFruit); // fruits in basket get added to the enemy score
            pickedFruit = []; // basket is empty again
            if(player.runs < 1){
                endGame();
            }
            player.hit = true; // set player hit status to avoid continued collision during timeout
            updateInfo(); // update info on scores
            player.sprite = 'images/redhead-hit.png'; // swap images for 'animation' of character
            setTimeout(function() { 

                // reset player position and image after a short 'animated' pause
                player.col = 3; 
                player.row = 4;
                player.sprite = 'images/redhead.png'; 
                player.hit = false;
            }, 500);
        }
    }
}

// fruit on same tile as enemy or player? it's eaten / picked

function checkFruitTaken(){
    allFruit.forEach(function (fruit, index) {

        // check if player is on fruit tile
        if (player.row === fruit.row && player.col === fruit.col){
            // fruit gets picked
            fruit.getsPicked();
            pickedFruit.push(fruit);
            updateInfo();  
        };

        // check if enemy is on fruit tile
        let enemyOnTile = allEnemies.filter(enemy => enemy.row === fruit.row && enemy.col === fruit.col);
        if (enemyOnTile.length > 0){
            if (fruit.eaten === true){
                return; // since we have a time out function we need to check if fruit has already been eaten
            } else {
                fruit.getsEeaten();
                eatenFruit.push(fruit);
                updateInfo();
            }
        }
    });

    // if player's basket is empty and all fruit are gone from field, create some new ones
    if (allFruit.length === 0 && pickedFruit.length === 0 && gameStarted === true) {
        createFruit();
    } 
}

// player reaches the other end of garden 

function levelUp(){
    collectedFruit = collectedFruit.concat(pickedFruit); // fruit is secured to player score
    pickedFruit = [];
    allFruit = [];
    player.runs -= 1; // one less go for the player now
    if (player.runs < 1){
        endGame(); // end of game reached?
    } else {
        createFruit(); // new fruit

        // update game Level for more & faster snails, 3 is max
        if (gameLevel === 3){
            updateInfo();
        } else {
            gameLevel ++;
            createEnemies(1);
            updateInfo();
        }
    }
}

/* Start Game
====================== */

// create player

const player = new Player;

// start up Game or restart game

function startGame(){
    gameStarted = true;
    // initiation
    createFruit();
    createEnemies(); 
    // (re)setting
    gameOver = false;
    gameLevel = 1;
    eatenFruit = [];
    collectedFruit = [];
    player.runs = 6;
    updateInfo();
    infoPanel.remove();
}

/* Game Over
====================== */

// this handles the end of a game

function endGame(){
    gameOver = true;
    gameStarted = false;
    allEnemies = [];
    allFruit = [];
    pickedFruit = [];
    //displayResult();
    resultMessage();
    updateInfo();
}

// display different messages for the different results based on: 
// won against snails? and fruit collected

function checkResult(){
    if(collectedFruit.length < eatenFruit.length){
        return 'lost';
    } else if(collectedFruit.length === eatenFruit.length)  {
        return 'even';
    } else {
        if(collectedFruit.length >= 8){
            return 'won';
        } else {
            return 'ok';
        }
    }
}

function resultMessage(result){
    result = checkResult();
    switch (result) {
    case 'won':
        resultHeadline = "You won!"
        resultText = "Wow, well done. Those snails never stood a chance!";
        break;
    case 'ok':
        resultHeadline = "Faster than the snails..."
        resultText = "... but for all that running around, you didn't get that many strawberries.";
        break;
    case 'lost':
        resultHeadline = "Oh dear."
        resultText = "The snails really took to your garden. Not much left for you.";
        break;
    case 'even':
        resultHeadline = "Fair Share!"
        resultText = "Well, there is enough for everyone, really.";
        break;
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

startButton.addEventListener('click', startGame);