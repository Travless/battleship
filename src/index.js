import _ from 'lodash';
import './style.css';
import { createGameboard, createSpace, createShip } from './classes';

const content = document.getElementById('content');




function generatePage(){
    const pageCont = document.createElement('div');
    pageCont.classList.add('page-cont');
    content.append(pageCont);

    const turnCont = document.createElement('div');
    turnCont.classList.add('turn-cont');
    pageCont.append(turnCont);

    const turnSpan = document.createElement('span');
    turnSpan.classList.add('turn-span');
    turnSpan.innerText = 'Turn: ';
    turnCont.append(turnSpan);

    const infoCont = document.createElement('div');
    infoCont.classList.add('info-cont');
    pageCont.append(infoCont);

    const infoSpan = document.createElement('span');
    infoSpan.classList.add('info-span');
    infoSpan.innerText = 'Info: ';
    infoCont.append(infoSpan);

    // let gameboard = generateBoard();
    const gameboard = document.createElement('div');
    gameboard.classList.add('gameboard');
    pageCont.append(gameboard);

    const optionsCont = document.createElement('div');
    optionsCont.classList.add('options-cont');
    pageCont.append(optionsCont);

    const carrierPreview = document.createElement('div');
    carrierPreview.classList.add('carrier-preview');
    carrierPreview.classList.add('carrier');
    optionsCont.append(carrierPreview);

    const battleshipPreview = document.createElement('div');
    battleshipPreview.classList.add('battleship-preview');
    battleshipPreview.classList.add('battleship');
    optionsCont.append(battleshipPreview);

    const cruiserPreview = document.createElement('div');
    cruiserPreview.classList.add('cruiser-preview');
    cruiserPreview.classList.add('cruiser');
    optionsCont.append(cruiserPreview);

    const submarinePreview = document.createElement('div');
    submarinePreview.classList.add('submarine-preview');
    submarinePreview.classList.add('submarine');
    optionsCont.append(submarinePreview);

    const destroyerPreview = document.createElement('div');
    destroyerPreview.classList.add('destroyer-preview');
    destroyerPreview.classList.add('destroyer');
    optionsCont.append(destroyerPreview);

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

