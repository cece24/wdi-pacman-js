// Setup initial game stats
var score = 0;
var lives = 2;
var dots = 240;
var level = 1;
var fruit = setFruit();
var fruitAvailable = false;
var eatenGhosts = [];

var powerPellets = 4;


// Define your ghosts here
var inky = {
  menu_option: '1',
  name: 'Inky',
  colour: 'Red',
  character: 'Shadow',
  edible: false
}

var blinky = {
  menu_option: '2',
  name: 'Blinky',
  colour: 'Cyan',
  character: 'Speedy',
  edible: false
}

var pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
}

var clyde = {
  menu_option: '4',
  name: 'Clyde',
  colour: 'Orange',
  character: 'Pokey',
  edible: false
}

var ghosts = [inky, blinky, pinky, clyde];

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  setTimeout(function() {
    displayStats();
    showFruit();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log('****** Level ' + level + ' ******');
  console.log('Watch for this fruit: ' + fruit.name);
  console.log('Score: ' + score + '     Lives: ' + lives);
  console.log('\nDots Left: ' + dots);
  console.log('\nPower-Pellets: ' + powerPellets);
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line

  console.log('(d) Eat Dot');

  if (dots > 10) {
    console.log('(w) Eat 10 Dots');
  }

  if (dots >= 100) {
    console.log('(e) Eat 100 Dots');
  }

  console.log('(r) Eat all remaining dots');

  if (dots < 240 && fruitAvailable === true) {
    console.log('(a) Eat ' + fruit.name + ' (' + fruit.points + ' points)');
  }

  if (powerPellets > 0) {
    console.log('(p) Eat Power-Pellet');
  };
  ghosts.forEach(function(ghost) {
    var displayEdible;
    if (ghost.edible === true) {
      displayEdible = 'edible';
    } else {
      displayEdible = 'inedible';
    }
    console.log('(' + ghost.menu_option + ') Eat ' + ghost.name + ' (' + displayEdible + ')' );
  });
  console.log('(q) Quit');
}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}


// Menu Options
function eatDot(numDots) {
  console.log('\nChomp!');
  if (numDots === 'all') {
    score += dots;
    dots = 0;
  } else {
    score += numDots;
    dots -= numDots;
  }
}

function eatGhost(ghost) {
  if (ghost.edible === false) {
    lives--;
    console.log('\nOh no! Eaten by a ' + ghost.colour + ' ' + ghost.name + '!');
    checkLives();
  } else {
    var points = checkEatenGhosts(ghost.name);
    score += points;
    ghost.edible = false;
    console.log('\n Pac-Man ate a ' + ghost.character + ' ' + ghost.name + '!');

    eatenGhosts.push(ghost.name)
  }
}

function checkEatenGhosts(ghostName) {
  var ghostCounter = eatenGhosts.filter(function(ghost) {
    return ghost === ghostName;
  }).length;

  if (ghostCounter === 0) {
    return 200;
  } else if (ghostCounter === 1) {
    return 400;
  } else if (ghostCounter === 2) {
    return 800;
  } else {
    return 1600;
  }
}

function checkLives() {
  if (lives < 0) {
    console.log('You\'ve run out of lives!');
    process.exit();
  }
}

function setAllGhostsInedible() {
  ghosts.forEach(function(ghost) {
    ghost.edible = false;
  });
}

function eatPowerPellet() {
  score += 50;
  powerPellets--;
  ghosts.forEach(function(ghost) {
    ghost.edible = true;
  });
  setTimeout(setAllGhostsInedible, 10000);
  setTimeout(drawScreen, 10000);
}


function checkFourGhostsEaten() {
  var ghostsEdibleStatus = ghosts.filter(function(ghost) {
    return ghost.edible === true;
  });

  if (ghostsEdibleStatus.length > 0) {
    return false;
  } else {
    return true;
  }
}


// Check Level
// if powerPellets is 0 and dots is 0
// increase level by 1 and powerPellets and dots are reset
// all ghosts reset to inedible
// reset eatenGhosts array
function determineLevel() {
  if (powerPellets < 1 && dots < 1) {
    level++;
    powerPellets = 4;
    dots = 240;
    setAllGhostsInedible();
    fruit = setFruit();
    console.log('\nYou have leveled up!');
  }
}

// set the fruit for that Level
function setFruit() {
  if (level === 1) {
    return {name: 'Cherry', points: 100}
  } else if (level === 2) {
    return {name: 'Strawberry', points: 300}
  } else if (level === 3 || level === 4) {
    return {name: 'Orange', points: 500}
  } else if (level === 5 || level === 6) {
    return {name: 'Apple', points: 700}
  } else if (level === 7 || level === 8) {
    return {name: 'Pineapple', points: 1000}
  } else if (level === 9 || level === 10) {
    return {name: 'Galaxian Spaceship', points: 2000}
  } else if (level === 11 || level === 12) {
    return {name: 'Bell', points: 3000}
  } else if (level >= 13) {
    return {name: 'Key', points: 5000}
  }
}

function eatFruit() {
  score += fruit.points
}

function showFruit() {
  var random = Math.random()
  if (random <= 0.5) {
    fruitAvailable = true;
  } else {
    fruitAvailable = false;
  }
}

// modify screen stat display to show level - done
// another function to determine fruit to appear and points
// add conditionals for if all 256 levels are completed



// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'd':
      eatDot(1);
      break;
    case 'w':
      eatDot(10);
      break;
    case 'e':
      eatDot(100);
      break;
    case 'r':
      eatDot('all');
      break;
    case 'a':
      eatFruit();
      break;
    case 'p':
      if (powerPellets > 0 && checkFourGhostsEaten() === true) {
        eatPowerPellet();
        break;
      } else if (powerPellets < 1) {
        console.log('\nNo Power-Pellets left!');
        break;
      } else {
        console.log('\nEat all ghosts before eating another power pellet!');
        break;
      }
    case '1':
      eatGhost(ghosts[0]);
      break;
    case '2':
      eatGhost(ghosts[1]);
      break;
    case '3':
      eatGhost(ghosts[2]);
      break;
    case '4':
      eatGhost(ghosts[3]);
      break;
    default:
      console.log('\nInvalid Command!');
  }
}


//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', function(key) {
  process.stdout.write(key);
  processInput(key);
  determineLevel();
  setTimeout(drawScreen, 400); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', function() {
  console.log('\n\nGame Over!\n');
});
