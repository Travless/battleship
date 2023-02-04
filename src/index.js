import _, { lowerFirst } from 'lodash';
import './style.css';
import { createGameboard, createSpace, createShip } from './classes';

const flipButton = document.getElementById('flip-button');
const startButton = document.getElementById('start-button');
const optionsCont = document.querySelector('.options-cont');
const gameboardsCont = document.querySelector('#gameboard-cont');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn');

// Option choosing
let angle = 0;
function flip () {
    const optionsShips = Array.from(optionsCont.children);
    // if angle equals 0, return 90, otherwise return 0
    angle = angle === 0 ? 90 : 0
    optionsShips.forEach(optionsShip => optionsShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip);

// Creating Boards
const width = 10;

function createBoard(color, user){
    const gameBoardCont = document.createElement('div');
    gameBoardCont.classList.add('game-board');
    gameBoardCont.style.backgroundColor = color;
    gameBoardCont.id = user;

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

// Creating ships

class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship){
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length : 
    // handle verticle
    startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;

    let shipBlocks = [];

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

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    return {shipBlocks, valid, notTaken};
}

function addShipPiece(user, ship, startId){
    // Provides an array of all of the board blocks on a gameboard
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    // Generates a random true or false boolean;
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * (width * width));

    let startIndex = startId ? startId : randomStartIndex;

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

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

ships.forEach(ship =>  addShipPiece('computer', ship));

// Drag player ships
let draggedShip;
const optionShips = Array.from(optionsCont.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

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

//  Add highlight
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


// Game Logic

let gameOver = false;
let playerTurn;

// Start Game
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

let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

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

// Define Computer Go
function computerGo(){
    if(!gameOver){
        turnDisplay.textContent = 'Computer Go!';
        infoDisplay.textContent = 'The computer is thinking...';

        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll('#player div');

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

        setTimeout(() => {
            playerTurn = true;
            turnDisplay.textContent = 'Your Go!';
            infoDisplay.textContent = 'Please take your go.'
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 6000)
    }
}

function checkScore(user, userHits, userSunkShips){
    function checkShip(shipName, shipLength){
        if(
            userHits.filter(storeShipName => storeShipName === shipName).length === shipLength
        ){
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
    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);

    console.log('playerHits', playerHits);
    console.log('playerSunkShips', playerSunkShips);

    if(playerSunkShips.length === 5){
        infoDisplay.textContent = "You sunk all of the computer's sunk ships. You won!"
        gameOver = true;
    }
    if(computerSunkShips.length === 5){
        infoDisplay.textContent = "The computer has sunk all of your ships. You lose!"
        gameOver = true;
    }
}

startButton.addEventListener('click', startGame);