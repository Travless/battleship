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
