// imports
const prompt = require('prompt-sync')();

const cars = [];
let userResponse = -1;

function printMenu() {
  console.log(`
    Enter selection:
    1 - Add vehicle
    2 - Remove vehicle
    3 - View inventory (total: ${cars.length})
    4 - Switch to better UI

    0 - Exit
    `);
}

// This funcitons as a validation wrapper on the prompt function to disallow non-number inputs, and block further execution until number input is provided
function getUserNumberInput(promptString) {
  let input;
  let selectionIsInvalid = true;
  do {
    input = prompt(promptString);
    selectionIsInvalid = isNaN(parseInt(input));
    if (selectionIsInvalid) console.log('Error: The input provided was not a number, try again.');
  } while (selectionIsInvalid);
  // Breaking from the while loop means input is valid, and safe to return
  return parseInt(input);
}

function addVehicle() {
  const make = prompt('Enter the make: ');
  const model = prompt('Enter the model: ');
  const year = getUserNumberInput('Enter the year: ');
  cars.push({ make, model, year });
}

function removeVehicle() {
  const vehicleIndex = getUserNumberInput('Enter the index of the vehicle to remove: ');
  if (vehicleIndex >= 0 && vehicleIndex < cars.length) cars.splice(vehicleIndex, 1);
  else console.log('Invalid index, no cars were removed');
}

function viewInventory() {
  cars.forEach((car, index) => {
    console.log(`${index}) `, car);
  })
}

let shouldRunBetterUI = false;
function toggleBetterUI() {
  shouldRunBetterUI = !shouldRunBetterUI;
}

function handleUserInput(input) {
  switch (input) {
    case 0: break;
    case 1: addVehicle(); break;
    case 2: removeVehicle(); break;
    case 3: viewInventory(); break;
    case 4: toggleBetterUI(); break;
    default: // empty
  }
}

/**
 * Because the User Interface of for this program is terrible, an alternative solution that maintains a stable terminal would be nice.
 * Most of the rest of this code is dedicated to that solution.
 * Only the last funciton in this file has anything to do with the original solution.
 */

// Screen modes are declared in an object for a few reasons:
// 1. They're easily accessible and readable
// 2. They're easily iterable
// 3. They're easily extensible
// 4. It's easy to spot a typo because the IDE will underline it
const CURSOR_STRING = '\'--->>> ';
const CLOSING_CURSOR_STRING = ' <<<---';
const MENU_OPTIONS_START_INDEX = 17;
const MENU_DISPLAY_START_INDEX = 7;
const MENU_MODES = {
  MAIN: 'main',
  ADD_VEHICLE: 'addVehicle',
  REMOVE_VEHICLE: 'removeVehicle',
  VIEW_INVENTORY: 'viewInventory',
}

// This screen object is used to keep track of what should be showing on the screen at any given time.
let menuLines = [];
let screen = { 
  mode: MENU_MODES.MAIN,
  addVehicleState: {
    make: null,
    model: null,
    year: null,
  },
};

function setHeaderLines() {
  switch (screen.mode) {
    case MENU_MODES.MAIN: {
      menuLines[0] = `|      .___  ___.      ___       __  .__   __.    .___  ___.  _______ .__   __.  __    __                                    |`
      menuLines[1] = `|      |   \\/   |     /   \\     |  | |  \\ |  |    |   \\/   | |   ____||  \\ |  | |  |  |  |                                   |`
      menuLines[2] = `|      |  \\  /  |    /  ^  \\    |  | |   \\|  |    |  \\  /  | |  |__   |   \\|  | |  |  |  |                                   |`
      menuLines[3] = `|      |  |\\/|  |   /  /_\\  \\   |  | |  .    |    |  |\\/|  | |   __|  |  . '  | |  |  |  |                                   |`
      menuLines[4] = `|      |  |  |  |  /  _____  \\  |  | |  |\\   |    |  |  |  | |  |____ |  |\\   | |  '--'  |                                   |`
      menuLines[5] = `|      |__|  |__| /__/     \\__\\ |__| |__| \\__|    |__|  |__| |_______||__| \\__|  \\______/                                    |`
    } break;
    case MENU_MODES.ADD_VEHICLE: {
      menuLines[0] = `|           ___       _______   _______     ____    ____  _______  __    __   __    ______  __       _______                 |`
      menuLines[1] = `|          /   \\     |       \\ |       \\    \\   \\  /   / |   ____||  |  |  | |  |  /      ||  |     |   ____|                |`
      menuLines[2] = `|         /  ^  \\    |  .--.  ||  .--.  |    \\   \\/   /  |  |__   |  |__|  | |  | |  ,----'|  |     |  |__                   |`
      menuLines[3] = `|        /  /_\\  \\   |  |  |  ||  |  |  |     \\      /   |   __|  |   __   | |  | |  |     |  |     |   __|                  |`
      menuLines[4] = `|       /  _____  \\  |  '--'  ||  '--'  |      \\    /    |  |____ |  |  |  | |  | |  '----.|  '----.|  |____                 |`
      menuLines[5] = `|      /__/     \\__\\ |_______/ |_______/        \\__/     |_______||__|  |__| |__|  \\______||_______||_______|                |`
    } break;
    case MENU_MODES.REMOVE_VEHICLE: {
      menuLines[0] = `|     .______       _______ .___  ___.   ______   ____    ____  _______                                                      |`
      menuLines[1] = `|     |   _  \\     |   ____||   \\/   |  /  __  \\  \\   \\  /   / |   ____|                                                     |`
      menuLines[2] = `|     |  |_)  |    |  |__   |  \\  /  | |  |  |  |  \\   \\/   /  |  |__                                                        |`
      menuLines[3] = `|     |      /     |   __|  |  |\\/|  | |  |  |  |   \\      /   |   __|                                                       |`
      menuLines[4] = `|     |  |\\  \\----.|  |____ |  |  |  | |  '--'  |    \\    /    |  |____                                                      |`
      menuLines[5] = `|     | _| '._____||_______||__|  |__|  \\______/      \\__/     |_______|                                                     |`
    } break;
    case MENU_MODES.VIEW_INVENTORY: {
      menuLines[0] = `|      __  .__   __. ____    ____  _______ .__   __. .___________.  ______   .______     ____    ____                        |`
      menuLines[1] = `|     |  | |  \\ |  | \\   \\  /   / |   ____||  \\ |  | |           | /  __  \\  |   _  \\    \\   \\  /   /                        |`
      menuLines[2] = `|     |  | |   \\|  |  \\   \\/   /  |  |__   |   \\|  | '---|  |----'|  |  |  | |  |_)  |    \\   \\/   /                         |`
      menuLines[3] = `|     |  | |  . '  |   \\      /   |   __|  |  . '  |     |  |     |  |  |  | |      /      \\_    _/                          |`
      menuLines[4] = `|     |  | |  |\\   |    \\    /    |  |____ |  |\\   |     |  |     |  '--'  | |  |\\  \\----.   |  |                            |`
      menuLines[5] = `|     |__| |__| \\__|     \\__/     |_______||__| \\__|     |__|      \\______/  | _| '._____|   |__|                            |`
    } break;
  }

  // Replace the rest of the lines with empty lines as a blank slate for anything else that needs to be printed
  // This implies that the entire screen is reprinted every time, which isn't actually wasteful in the context of a terminal,
  // because it needs to be cleared anyways, and the logging is the slowest part of the process by far.
  for(let i = 6; i < 20; i++) setEmptyLine(i);
}

function setEmptyLine(index) {
  menuLines[index] = `|                                                                                                                            |`
}

function insert(baseString, index, input) {
// Mimics the behavior of a cursor's insert mode, but for strings
  return baseString.slice(0, index) + input + baseString.slice(index + input.length);
}

// Instead of directly assigning the menuLines strings, we're going to splice text over the existing whitespace using the String.splice method
function setMainMenuBody() {
  menuLines[MENU_OPTIONS_START_INDEX - 3] = insert(menuLines[MENU_OPTIONS_START_INDEX - 3], 8, `3 - View inventory (total: ${cars.length})`);
  menuLines[MENU_OPTIONS_START_INDEX - 2] = insert(menuLines[MENU_OPTIONS_START_INDEX - 2], 8, '2 - Remove vehicle');
  menuLines[MENU_OPTIONS_START_INDEX - 1] = insert(menuLines[MENU_OPTIONS_START_INDEX - 1], 8, '1 - Add vehicle');
  menuLines[MENU_OPTIONS_START_INDEX] = insert(menuLines[MENU_OPTIONS_START_INDEX], 8, '0 - Quit');
}

function setAddVehicleMenu() {
  // Depending on which input is required, show the already entered inputs with checkmarks next to them, and the next input with a cursor pointing to it
  if (screen.addVehicleState.make === null) {
    menuLines[MENU_DISPLAY_START_INDEX] = insert(insert(menuLines[7], 0, CURSOR_STRING), 8, '[ ] Make  - ' + CLOSING_CURSOR_STRING)
    menuLines[MENU_DISPLAY_START_INDEX + 1] = insert(menuLines[8], 8, '[ ] Model -');
    menuLines[MENU_DISPLAY_START_INDEX + 2] = insert(menuLines[9], 8, '[ ] Year  -');
  } else if (screen.addVehicleState.model === null) {
    menuLines[MENU_DISPLAY_START_INDEX] = insert(menuLines[7], 8, `[X] Make  - ${screen.addVehicleState.make}`);
    menuLines[MENU_DISPLAY_START_INDEX + 1] = insert(insert(menuLines[8], 0, CURSOR_STRING), 8, '[ ] Model - ' + CLOSING_CURSOR_STRING);
    menuLines[MENU_DISPLAY_START_INDEX + 2] = insert(menuLines[9], 8, '[ ] Year  -');
  } else if (screen.addVehicleState.year === null) {
    menuLines[MENU_DISPLAY_START_INDEX] = insert(menuLines[7], 8, `[X] Make  - ${screen.addVehicleState.make}`);
    menuLines[MENU_DISPLAY_START_INDEX + 1] = insert(menuLines[8], 8, `[X] Model - ${screen.addVehicleState.model}`);
    menuLines[MENU_DISPLAY_START_INDEX + 2] = insert(insert(menuLines[9], 0, CURSOR_STRING), 8, '[ ] Year  - ' + CLOSING_CURSOR_STRING);
  } else {
    menuLines[MENU_DISPLAY_START_INDEX] = insert(menuLines[7], 8, `[X] Make  - ${screen.addVehicleState.make}`);
    menuLines[MENU_DISPLAY_START_INDEX + 1] = insert(menuLines[8], 8, `[X] Model - ${screen.addVehicleState.model}`);
    menuLines[MENU_DISPLAY_START_INDEX + 2] = insert(menuLines[9], 8, `[X] Year  - ${screen.addVehicleState.year}`);
    menuLines[MENU_OPTIONS_START_INDEX - 1] = insert(menuLines[11], 8, '1 - Confirm');
    menuLines[MENU_OPTIONS_START_INDEX] = insert(menuLines[10], 8, '0 - Quit to Main Menu');
  }
}

function setInventoryMenu() {
  // Print a table at the MENU_DISPLAY_START_INDEX of the cars with columns: index, make, model, and year
  // Print instructions at the MENU_OPTIONS_START_INDEX to enter a number to remove a car
  menuLines[MENU_DISPLAY_START_INDEX] = insert(menuLines[MENU_DISPLAY_START_INDEX], 20, '| Number | Make        | Model        | Year |');
  cars.forEach((car, index) => {
    const currentRowIndex = MENU_DISPLAY_START_INDEX + index + 1;

    // Start inserting data at the 20th column (starting at the first value row value, index)
    let startColumnIndex = 20;

    // Start with a blank table line
    let rowString = insert(menuLines[currentRowIndex], startColumnIndex, '|        |             |              |      |');

    startColumnIndex += 2;
    rowString = insert(rowString, startColumnIndex, `${index + 1}`);

    startColumnIndex += 9;
    rowString = insert(rowString, startColumnIndex, `${car.make}`);

    startColumnIndex += 14;
    rowString = insert(rowString, startColumnIndex, `${car.model}`);

    startColumnIndex += 15;
    rowString = insert(rowString, startColumnIndex, `${car.year}`);

    menuLines[currentRowIndex] = rowString;
  });

  menuLines[MENU_OPTIONS_START_INDEX] = insert(menuLines[MENU_OPTIONS_START_INDEX], 8, '0 - Quit to Main Menu');
}

function setRemoveVehicleMenu() {
  setInventoryMenu();
  menuLines[MENU_OPTIONS_START_INDEX] = insert(menuLines[MENU_OPTIONS_START_INDEX], 8, '0 - Quit to Main Menu');
  if (!cars.length) menuLines[MENU_OPTIONS_START_INDEX - 1] = insert(menuLines[MENU_OPTIONS_START_INDEX - 1], 8, '1 - No vehicles to remove');
  if (cars.length === 1) menuLines[MENU_OPTIONS_START_INDEX - 1] = insert(menuLines[MENU_OPTIONS_START_INDEX - 1], 8, '1 - Remove this vehicle');
  else if (cars.length) menuLines[MENU_OPTIONS_START_INDEX - 1] = insert(menuLines[MENU_OPTIONS_START_INDEX - 1], 8, `1-${cars.length} Remove vehicle`);
}

function printMenuBetter() {
  setHeaderLines();
  switch (screen.mode) {
    case MENU_MODES.MAIN: setMainMenuBody(); break;
    case MENU_MODES.ADD_VEHICLE: setAddVehicleMenu(); break;
    case MENU_MODES.REMOVE_VEHICLE: setRemoveVehicleMenu(); break;
    case MENU_MODES.VIEW_INVENTORY: setInventoryMenu();
  }
  menuLines.forEach(line => console.log(line));
}

function handleMenuInput() {
  const numberInput = getUserNumberInput(CURSOR_STRING + 'Enter menu selection: ');
  switch (numberInput) {
    case 0: return 0;
    case 1: screen.mode = MENU_MODES.ADD_VEHICLE; break;
    case 2: screen.mode = MENU_MODES.REMOVE_VEHICLE; break;
    case 3: screen.mode = MENU_MODES.VIEW_INVENTORY; break;
    case 4: toggleBetterUI(); break;
    default: // empty
  }

  // 0 codes for quitting in this context, so anything but 0 keeps the loop running
  // It's common to name a variable for no other reason than to give it a little more context
  const KEEP_THE_LOOP_RUNNING = 1;
  return KEEP_THE_LOOP_RUNNING;
}

function handleAddVehicleInput() {
  if (screen.addVehicleState.make === null) {
    screen.addVehicleState.make = prompt('Enter the make: ');
  } else if (screen.addVehicleState.model === null) {
    screen.addVehicleState.model = prompt('Enter the model: ');
  } else if (screen.addVehicleState.year === null) {
    screen.addVehicleState.year = getUserNumberInput('Enter the year: ');
  } else {
    const numberInput = getUserNumberInput(CURSOR_STRING + 'Enter menu selection: ');
    switch (numberInput) {
      case 0: {
        screen.addVehicleState = { make: null, model: null, year: null };
        screen.mode = MENU_MODES.MAIN;
      } break;
      case 1: {
        // This ... is called the spread operator. It takes all the properties of an object and puts them into a new object.
        cars.push({ ...screen.addVehicleState });
        screen.addVehicleState = { make: null, model: null, year: null };
        screen.mode = MENU_MODES.MAIN;
      } break;
      default: // empty
    }
  }
}

function handleRemoveVehicleInput() {
  const numberInput = getUserNumberInput(CURSOR_STRING + 'Enter the number to remove: ');
  if (numberInput === 0) screen.mode = MENU_MODES.MAIN;
  else if (numberInput > 0 && numberInput <= cars.length) cars.splice(numberInput - 1, 1);
}

function handleViewInventoryInput() {
  const numberInput = getUserNumberInput(CURSOR_STRING + 'Enter menu selection: ');
  if (numberInput === 0) screen.mode = MENU_MODES.MAIN;
}

function handleUserInputBetter() {
  switch (screen.mode) {
    case MENU_MODES.MAIN: return handleMenuInput(); break;
    case MENU_MODES.ADD_VEHICLE: return handleAddVehicleInput(); break;
    case MENU_MODES.REMOVE_VEHICLE: return handleRemoveVehicleInput(); break;
    case MENU_MODES.VIEW_INVENTORY: return handleViewInventoryInput(); break;
  }
}


function mainLoop() {
  while (userResponse !== 0) {
    if (!shouldRunBetterUI) {
      printMenu();
      userResponse = getUserNumberInput('Enter menu selection: ');
      handleUserInput(userResponse);
    } else {
      printMenuBetter();

      // Because the menu has multiple modes now, the input can't simply be passed in as a number argument.
      // Instead, it's collected in each of the handle funcitons, and then important navigation information is passed back
      userResponse = handleUserInputBetter();
      // this is the magic sauce that makes the terminal stop growing like one of those lame firework snakes
      if (userResponse !== 0) console.clear();
      else console.log(cars)
    }
  }
}


// This entire file is function declarations that won't actually do anything until they're called.
// The mainLoop funciton has a while loop that will only run if the mainLoop funciton is actually called...
// So we're calling it here.
mainLoop();
