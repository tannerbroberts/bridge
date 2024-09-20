/**
 * It turns out that there is a way to get input in the console without having to press the enter key.
 * This opens an avenue for a game to be created where the user doesn't need to press the enter key to submit their input.
https://stackoverflow.com/questions/50/nodejs-how-to-read-keystrokes-from-stdin?rq=3
 */

let mostRecentKey = '';
process.stdin.setRawMode(true);
process.stdin.on("data", function(charBuffer) {
  const char = charBuffer.toString();
  if (char === "q") {
    process.exit();
  }
  mostRecentKey = char;
  console.log('you pressed:', char);
});
const MAX_WIDTH = 50;
const MAX_HEIGHT = 20;

function printGameScreen(locationOfPlayer, lines) {
  console.log('player location: ', locationOfPlayer);

  // These curly brackets are "destructuring" the object 'locationOfPlayer' into it's two properties 'x' and 'y'.
  // This doesn't delete locationOfPlayer, it just creates two variables for the properties 'x' and 'y' that are easier to use.
  // If x and y were objects instead of primitive number values, then the variables x and y would be REFERENCES to the SAME objects as locationOfPlayer.x and locationOfPlayer.y.
  // But in this case, x and y are just numbers, so changing x or y will be their own variables with no effect on locationOfPlayer.x or locationOfPlayer.y.
  const { x, y } = locationOfPlayer;
  lines.forEach((line, index) => {
    if (index === y) {
      // This line is the one the player is on, so we need to replace the character at the x position with the player character
      console.log(line.slice(0, x) + '@' + line.slice(x + 1));
    } else {
      console.log(line);
    }
  })
}

function updatePlayerLocation(playerLocation, input) {
  switch(input) {
    case 'w': playerLocation.y = Math.max(0, Math.min(MAX_WIDTH, playerLocation.y - 1)); break;
    case 'a': playerLocation.x = Math.max(0, Math.min(MAX_WIDTH, playerLocation.x - 1)); break;
    case 's': playerLocation.y = Math.max(0, Math.min(MAX_WIDTH, playerLocation.y + 1)); break;
    case 'd': playerLocation.x = Math.max(0, Math.min(MAX_WIDTH, playerLocation.x + 1)); break;
    default: console.log('use w, a, s, d to move, q to quit, and dont run into walls...its a bad idea');
  }
}

const playerLocation = { x: 0, y: 0 };
const gameScreenLines = [];
for (let i = 0; i < MAX_HEIGHT; i++) gameScreenLines.push(new Array(MAX_WIDTH).join('.'));
function takeGameStep() {

  // This if statement is checking for any key presses that have been made since the last frame
  if (mostRecentKey !== '') {
    const input = mostRecentKey;
    mostRecentKey = '';
    updatePlayerLocation(playerLocation, input, gameScreenLines);
    // Clear the console in preperation for the next frame
    console.clear();
    printGameScreen(playerLocation, gameScreenLines);
  }
}

console.clear();
printGameScreen(playerLocation, gameScreenLines);
setInterval(takeGameStep, 1000 / 60); // 60 frames per second, do this
