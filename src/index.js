import _, { lowerFirst } from 'lodash';
import './style.css';
import { createGameboard, createSpace, createShip } from './classes';

const flipButton = document.getElementById('flip-button');
const startButton = document.getElementById('start-button');
const optionsCont = document.querySelector('.options-cont');
const gameboardsCont = document.querySelector('#gameboard-cont');

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

function addShipPiece(ship){
    // Provides an array of all of the board blocks on a gameboard
    const allBoardBlocks = document.querySelectorAll('#computer div');
    // Generates a random true or false boolean;
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * (width * width));

    let validStart = isHorizontal ? randomStartIndex <= width * width - ship.length ? randomStartIndex : width * width - ship.length : 
    // handle verticle
    randomStartIndex <= width * width - width * ship.length ? randomStartIndex : randomStartIndex - ship.length * width + width;

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

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        })
    } else {
        addShipPiece(ship);
    }
}

ships.forEach(ship =>  addShipPiece(ship));