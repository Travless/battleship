import _, { lowerFirst } from 'lodash';
import './style.css';
import { createGameboard, createSpace, createShip } from './classes';


// Element Selectors
const flipButton = document.getElementById('flip-button');
const startButton = document.getElementById('start-button');
const optionsCont = document.querySelector('.options-cont');
const gameboardsCont = document.querySelector('#gameboard-cont');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn');



// Option choosing
let angle = 0;
// function that controls the action of flipping the direction in which the ships are placed
function flip () {
    const optionsShips = Array.from(optionsCont.children);
    // if angle equals 0, return 90, otherwise return 0
    angle = angle === 0 ? 90 : 0
    optionsShips.forEach(optionsShip => optionsShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip);



// CREATING BOARDS 

// Define width of board
const width = 10;

// Function that generates the gameboard for the user
function createBoard(color, user){
    const gameBoardCont = document.createElement('div');
    gameBoardCont.classList.add('game-board');
    gameBoardCont.style.backgroundColor = color;
    // Provides link to the user who the board is being used by
    gameBoardCont.id = user;

    // For loop that creates a set amount of divs that will represent the spaces on the board
    for(let i = 0; i < width * width; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardCont.append(block);
    }

    gameboardsCont.append(gameBoardCont);
}

createBoard('yellow', 'player');
createBoard('pink', 'computer');




// CREATING SHIPS

// Ship class that is used to generate ship objects
class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
    }
}

// Each ship piece defined and generated via the Ship class
const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

// Array of defined ships
const ships = [destroyer, submarine, cruiser, battleship, carrier];

let notDropped;

// Checks validity of spaces attempting to be used based on availability, OOB, wrapping, etc
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship){
    // Handles horizontal; if isHorizontal is true, the starting index will equal the width multiplied by itself minus the length of the ship
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length : 
    // handle verticle if isHorizontal is false, then the starting index will equal the width multiplied by itself minus the product of the width multiplied by the ship.length
    startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;

    // Array that will store blocks that ship will emcompass
    let shipBlocks = [];

    // Loops through the Board Blocks array starting at the index based on the valid start, incrementing the index by i if isHorizontal true, and by i multiplied  by the width is isHorizontal is false
    for (let i = 0; i < ship.length; i++){
        if(isHorizontal){
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
        }
    }

    // Keeps ships from being placed in invalid spots via wrapping around the board
    let valid;
    if (isHorizontal){
        shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id < 90 + (width * index + 1))
    }

    // Loops through shipBlocks array to pull which blocks don't include the class 'taken'
    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    return {shipBlocks, valid, notTaken};
}


// Function that adds ships to gameboards
function addShipPiece(user, ship, startId){
    // Provides an array of all of the board blocks on a gameboard based on provided user
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    // Generates a random true or false boolean;
    let randomBoolean = Math.random() < 0.5;
    // if user equals player then the angel will equal 0, and if the user equals computer then a randomBoolean value will be assigned
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    // Generates a random value to be used as the starting index for the computer, baased on the dimensions of the board (width * width)
    let randomStartIndex = Math.floor(Math.random() * (width * width));

    // Starting index for the piece being placed. If a startId exists, use the startId for the player, but if not, generate a randomStartIndex for the computer
    let startIndex = startId ? startId : randomStartIndex;

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    // if valid and notTaken are both true, add the ship's name and 'taken' to the class list of each block within the shipBlocks array
    // if not, if the user equals computer, pass the addShipPiece function recurssively, and if the user equals the player, then set notDropped to true
    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId);
        if (user === 'player') notDropped = true;
    }
}

// At the page load, for each ship within the ships array, add the respective ship piece to the computer's board 
ships.forEach(ship =>  addShipPiece('computer', ship));



// Draggability for Player Ships

// Create array of the preview ships below the player gameboard and add an event listener to each of them that triggers the dragStart function when the ship is clicked and dragged
let draggedShip;
const optionShips = Array.from(optionsCont.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

// select all children divs with the id of player, and add an event listener 
const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver);
    playerBlock.addEventListener('drop', dropShip);
})

function dragStart(e){
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e){
    e.preventDefault();
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ship)
}

function dropShip(e){
    const startId = e.target.id;
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if(!notDropped){
        draggedShip.remove();
    }
}

//  Function that adds a highlighted trail over gameboard to show where piece is being placed if browser doesn't support a preview attacched to the drag
function highlightArea(startIndex, ship){
    const allBoardBlocks = document.querySelectorAll('#player div');
    let isHorizontal = angle === 0;

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if(valid && notTaken){
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover');
            setTimeout(() => shipBlock.classList.remove('hover'), 500)
        })
    }
}


// GAME LOGIC

let gameOver = false;
let playerTurn;

// Function that starts the game
function startGame(){
    if(playerTurn === undefined){
        if (optionsCont.children.length != 0) {
            infoDisplay.textContent = 'Please place all of your pieces first!'
        } else {
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
            playerTurn = true;
            turnDisplay.textContent = 'Your Go!';
            infoDisplay.textContent = 'The game has started!'
        }
    }
}

// Defines arrays that track player hits, computer hits, player's sunken ships, and computer's sunken ships
let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

// Function that checks if player hit the computer's ship or if it is a missed, based on if the div that the player clicked on contains the class "taken" (hit) or not (miss)
// if it is a hit, an array of the div's classes will be created with the boom, block and taken filtered out to leave the name of the ship
// if it is not a hit, the class "empty" will be added to the div to then get the appropriate styling for a miss on the board as well
// Following the outcome of that if else statement, playerTurn will be changed to false, allBoardBlocks will eb given all of the child divs within the computer's board and the computer's turn will begin
function handleClick(e){
    if(!gameOver){
        if(e.target.classList.contains('taken')){
            e.target.classList.add('boom');
            infoDisplay.textContent = "You hit the computer's ship!";
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className !== 'block')
            classes = classes.filter(className => className !== 'boom')
            classes = classes.filter(className => className !== 'taken')
            playerHits.push(...classes);
            checkScore('player', playerHits, playerSunkShips)
        }
        if(!e.target.classList.contains('taken')) {
            infoDisplay.textContent = 'Nothing hit this time';
            e.target.classList.add('empty');
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000);
    }
}

// Function that processes the computer's move
function computerGo(){
    // If the game is still ongoing, turnDisplay and infoDisplay will relay that the computer is processing its move
    if(!gameOver){
        turnDisplay.textContent = 'Computer Go!';
        infoDisplay.textContent = 'The computer is thinking...';

        // Set a timeout that is used to time the computer's decision to seem as though it is processing by 3000ms
        // Generate a random index based on the dimmensions of the board then set the array allBoardBlocks to include all of the child divs of the player's spaces
        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll('#player div');

            // If the space of the allBoardBlocks that was selected based on the random index contains the classes taken and boom, execute the computerGo function again recursively
            // If the space contains the class taken but not the class boom, add the class boom to the div, create a new array of the space's classes while filtering out all except the name and push them into the computerHits array and provide a score update with the checkScore function
            // If the space contains neither taken or boom, add the class empty to signify a missed space
            if(allBoardBlocks[randomGo].classList.contains('taken') && allBoardBlocks[randomGo].classList.contains('boom')){
                computerGo()
                return
            }else if(allBoardBlocks[randomGo].classList.contains('taken') && !allBoardBlocks[randomGo].classList.contains('boom')){
                allBoardBlocks[randomGo].classList.add('boom');
                infoDisplay.textContent = 'The computer hit your ship!';
                let classes = Array.from(allBoardBlocks[randomGo].classList)
                classes = classes.filter(className => className !== 'block')
                classes = classes.filter(className => className !== 'boom')
                classes = classes.filter(className => className !== 'taken')
                computerHits.push(...classes);
                checkScore('computer', computerHits, computerSunkShips);
            } else {
                infoDisplay.textContent = 'Nothing hit this time.'
                allBoardBlocks[randomGo].classList.add('empty');
            }
        }, 3000)
        // Set a timeout for 6000ms, that sets up the player's move
        setTimeout(() => {
            playerTurn = true;
            turnDisplay.textContent = 'Your Go!';
            infoDisplay.textContent = 'Please take your go.'
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 6000)
    }
}

// Function used to check the score of the current game
// Takes in the user, the user's hits array, and the user's sunken ships array
function checkScore(user, userHits, userSunkShips){
    // Function that check's the status of the ship based on its name and length
    function checkShip(shipName, shipLength){
        // Checks if the shipName passed in matches the stored shipName and that the passed in length matches the store ship's length as well
        if(
            userHits.filter(storeShipName => storeShipName === shipName).length === shipLength
        ){
            // if so, a check will be done to see if it's the player's ship or the computer's ship and will filter out the ship from the array holding the current hits
            // Finally, the ship name will be pushed into the respective user's sunken ship array to keep track of the ships that are currently no longer in play and should be counted towards the end goal
            if(user === 'player') {
                infoDisplay.textContent = `You sunk the computer's ${shipName}!`;
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if(user === 'computer') {
                infoDisplay.textContent = `The computer sunk your ${shipName}!`;
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName);
        }
    }
    
    // status of each ship is checked for the user with a console log showing the current status
    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);

    console.log('playerHits', playerHits);
    console.log('playerSunkShips', playerSunkShips);

    // If the length of either the player or computer's sunken ship array equals 5, gameOver will be triggered to true, ending the game and providing the delaritive win/loss message
    if(playerSunkShips.length === 5){
        infoDisplay.textContent = "You sunk all of the computer's sunk ships. You won!"
        gameOver = true;
    }
    if(computerSunkShips.length === 5){
        infoDisplay.textContent = "The computer has sunk all of your ships. You lose!"
        gameOver = true;
    }
}


// Event listener for the startButton that will trigger the start of the game once all ships for the player are placed
startButton.addEventListener('click', startGame);