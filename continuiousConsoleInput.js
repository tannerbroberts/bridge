let mostRecentKeyCode = '';
process.stdin.setRawMode(true);
process.stdin.on("data", function(charBuffer) {
  // don't use toString() because it will convert the buffer to a string, which will make it impossible to detect the 'delete' key
  const char = charBuffer[0];
  mostRecentKeyCode = char;
});


// Game state constants
const SCREEN_WIDTH = 60;
const SCREEN_HEIGHT = 30;
const PLAYER_CHARACTER = '@';
// Game state variables
const gameScreen = Array.from({ length: SCREEN_WIDTH }, () => new Array(SCREEN_HEIGHT).fill('.'));
let inCommandMode = false;
let command = [];
const playerPosition = { x: 10, y: 5 };


function initializeGameState(playerPosition) {

  // Go through each character, and set it to a dot, except for where the player character is, which is set to the player character
  gameScreen.forEach((column, x) => {
    column.forEach((char, y) => {
      if (x === playerPosition.x && y === playerPosition.y) {
        gameScreen[x][y] = PLAYER_CHARACTER;
      } else {
        gameScreen[x][y] = '.';
      }
      // Actually print the character to the screen instead of just the array
      editScreenAt(x, y, gameScreen[x][y]);
    });
  });
}


// Use process.stdout.write to print the changed character to the right location, and only the changed character, without clearing the screen, or even the line
// Also update the gameScreen array to reflect the change
const editScreenAt = (x, y, char) => {
  process.stdout.cursorTo(x, y);
  process.stdout.write(char);
  gameScreen[x][y] = char;
  // Reset the cursor to the bottom of the screen to avoid the cursor blinking in the middle of the screen
  process.stdout.cursorTo(0, SCREEN_HEIGHT);
}


function movePlayer(playerPosition, input) {
  const { x: oldX, y: oldY } = playerPosition;
  const newX = Math.max(0, Math.min(SCREEN_WIDTH - 1, oldX + (input === 'a' ? -1 : input === 'd' ? 1 : 0)));
  const newY = Math.max(0, Math.min(SCREEN_HEIGHT - 1, oldY + (input === 'w' ? -1 : input === 's' ? 1 : 0)));
  // Looks like the player ate the dot when replacing it with a space instead of another dot
  editScreenAt(oldX, oldY, ' ');
  editScreenAt(newX, newY, PLAYER_CHARACTER);
  playerPosition.x = newX;
  playerPosition.y = newY;
}


function clear() {
    // change all dots to spaces, but leave the player character alone
    gameScreen.forEach((column, x) => {
      column.forEach((char, y) => {
        if (char !== PLAYER_CHARACTER) editScreenAt(x, y, ' ');
      });
    });
}


function help(dict) {
    process.stdout.write(`Commands: ${Object.keys(dict).join(', ')}`);
}


function fill() {
  gameScreen.forEach((column, x) => {
    column.forEach((char, y) => {
      if (char !== PLAYER_CHARACTER) editScreenAt(x, y, '.');
    });
  });
}


const commandDictionary = {
  clear,
  fill,
  help: () => help(commandDictionary),
};


function commandMode_start() {
  command = [];
  inCommandMode = true;
  process.stdout.cursorTo(0, SCREEN_HEIGHT);
  process.stdout.clearLine();
  process.stdout.write('Command: ');
}


function commandMode_append(inputCharacter) {
  command.push(inputCharacter);
  process.stdout.write(inputCharacter);
}


function commandMode_backspace() {
  process.stdout.cursorTo(0, SCREEN_HEIGHT);
  process.stdout.clearLine();
  command.pop();
  process.stdout.write('Command: ' + command.join(''));
}


function commandMode_enter(command) {
  // Clear the 'Command: comand' line from sdout
  process.stdout.cursorTo(0, SCREEN_HEIGHT);
  process.stdout.clearLine();
  if (command.length) {
    if (commandDictionary[command]) commandDictionary[command]();
    else process.stdout.write('Invalid command: ' + command);
  }
  inCommandMode = false;
}


function gameTick() {
  // Only do stuff if the player has pressed a key
  // later, we'll do stuff besides that with NPC's and stuff
    if (mostRecentKeyCode !== '') {
      const input = mostRecentKeyCode; // Coded as a small integer, not a character
      const char = String.fromCharCode(input); // Converted to a character
      if (inCommandMode) {
        if (input === 127) commandMode_backspace();
        else if (input === 13) commandMode_enter(command.join(''));
        else commandMode_append(char);
      }
      else {
        switch(char) {
          case 'q':
            console.clear();
            process.exit();
            break;
          case 'w':
          case 'a':
          case 's':
          case 'd':
            movePlayer(playerPosition, char);
            break;
          case 'e':
            commandMode_start();
            break;
          default: // Do nothing for now.. we'll animage npcs and stuff later
        }
      }
      mostRecentKeyCode = '';
    }
}


// Program entry point
console.clear();
initializeGameState(playerPosition);
// We can't use while loops here because they block the ability to listen for key presses
// Instead, we run this function 60 times per second, allowing plenty of time for key presses in between
setInterval(gameTick, 1000 / 60); // 60 frames per second
