import _, { create } from 'lodash';
import './style.css';
import { createShip, createGameboard } from './classes';

const content = document.getElementById('content');

// const gameboard = new Gameboard();

const coordinates = [0,2];

document.addEventListener('click', function(event){
    let col = event.target.getAttribute('column');
    let row = event.target.parentNode.getAttribute('row');
    let postCoord = [{row, col}];

    // console.log(postCoord)

    // gameboard.placeShip(3, postCoord);
    // console.log(gameboard.playerShips);
})


function generateBoard(){
    for (let i = 0; i < 10; i++){
        let boardRow = document.createElement('div');
        boardRow.classList.add('row');
        boardRow.setAttribute('row', i);
        function spaceCreate (){
            for(let k = 0; k < 10; k++){
                const space = document.createElement('div');
                space.classList.add('column');
                space.setAttribute('column', k);
                boardRow.append(space);
            }
        }
        spaceCreate();
        content.append(boardRow);
    }
}

// gameboard.placeShip(0, 1, 3);
// console.log(gameboard.playerShips);

const gameboard = createGameboard();

console.log(gameboard.placeShip(3, coordinates));