import _ from 'lodash';
import './style.css';
import { createGameboard, createSpace, createShip } from './classes';

const content = document.getElementById('content');




function generatePage(){
    const pageCont = document.createElement('div');
    pageCont.setAttribute('id', 'page-cont');

    const turnCont = document.createElement('div');
    turnCont.setAttribute('id', 'turn-cont');
    pageCont.append(turnCont);

    const turnSpan = document.createElement('span');
    turnSpan.setAttribute('id', 'turn-span');
    turnCont.append(turnSpan);

    const infoCont = document.createElement('div');
    infoCont.setAttribute('id', 'info-cont');
    pageCont.append(infoCont);

    const infoSpan = document.createElement('span');
    infoSpan.setAttribute('id', 'info-span');
    infoCont.append(infoSpan);

    let gameboard = generateBoard();

    const optionsCont = document.createElement('div');
    optionsCont.setAttribute('id', 'options-cont');
    pageCont.append(optionsCont);

    const carrierPreview = shipPreviewGen(carrier);
    const battleshipPreview = shipPreviewGen(battleship);
    const cruiserPreview = shipPreviewGen(cruiser);
    const submarinePreview = shipPreviewGen(submarine);
    const destroyerPreview = shipPreviewGen(destroyer);

    return pageCont;
}

function shipPreviewGen(name){
    const shipPreview = document.createElement('div');
    shipPreview.setAttribute('id', `${name}-preview`);
    optionsCont.append(shipPreview);
}


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
        pageCont.append(boardRow);
    }
}

// const gameboard = createGameboard();
// console.log(gameboard.placeShip(3, 0, 3));

const page = generatePage();
content.append(page);
