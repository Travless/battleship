// const { ModuleFilenameHelpers } = require("webpack");

class Ship {
    constructor(length){
        this.length = length,
        this.hits = 0,
        this.sunk = false
    }

    hit(){
        this.hits = this.hits + 1;
    }

    isSunk(){
        if(this.hits >= this.length){
            this.sunk = true;
        } else {
            this.sunk = false;
        }
    }
};

// Direction represents the direction the ship will be facing when placed. true === width, false === height
export class Gameboard {
    constructor(){
        this.playerShips = [];
        this.compShips = [];
        this.playerTurn = true;
        this.direction = true;
    }

    generateBoard(){
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

    placeShip(size, coord){
        const ship = new Ship(size);
        let availability = [];
        let location = []

        if(this.playerTurn === true){
            if(this.direction === true){
                for(let i = 0; i < size; i++){
                    let combine = parseFloat(coord[0].col) + parseFloat(1);
                    let colText = combine.toString();
                    coord[0].col = colText
                    console.log(coord[0].col);


                    let available = this.spaceCheckWidth(this.playerShips, coord, i);
                    availability.push(available);
                    if (available === false){
                        location.push(coord)
                    }
                }
                // if (availability.includes(true)){
                //     console.log("can't place here");
                // } else {
                //     this.playerShips.push([row, col]);
                // }
            }
        }
        // console.log(location);
    }

    spaceCheckWidth(array, coord, add){
        const spaceAvailable = array.includes(coord);
        return spaceAvailable;
    }
}

// module.exports = Ship