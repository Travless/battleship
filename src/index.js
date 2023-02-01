import _ from 'lodash';
import './style.css';
import { Gameboard, Ship } from './classes';

const content = document.getElementById('content');

const gameboard = new Gameboard();

gameboard.generateBoard();

document.addEventListener('click', function(event){
    let col = event.target.getAttribute('column');
    let row = event.target.parentNode.getAttribute('row');
    let postCoord = [{row, col}];

    // console.log(postCoord)

    gameboard.placeShip(3, postCoord);
    // console.log(gameboard.playerShips);
})
