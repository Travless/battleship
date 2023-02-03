import { throttle } from "lodash";

export function createShip(length){
    return {
        length,
        hits: 0,
        sunk: false,
        spaces: [],

        hit(){
            hit += 1;
        },

        isSunk(){
            if(this.hits >= this.length){
                this.sunk = true;
            } else {
                this.sunk = false;
            }
        }
    }
}

export function createSpace(row, col){
    return{
        row,
        col
    }
}

export function createGameboard(){
    return{
        gameOver: false,
        missedAttacks: [],
        playerShips: [[{row: 0, col: 1}, {row: 0, col: 2}], [{row: 2, col:6}, {row: 3, col: 6}]],

        placeShip(size, row, col){
            const ship = createShip(size);
            const originSpace = createSpace(row, col);
            originSpace.row = originSpace.row - 1;
            for(let i = 0; i < this.playerShips.length; i++){
                for(let j = 0; j < size; j++){
                    originSpace.row = originSpace.row + 1;
                    console.log(originSpace);
                    if(JSON.stringify(this.playerShips[i][j]) === JSON.stringify(originSpace)){
                        console.log('space taken');
                        return;
                    } else {
                        console.log('spot available');
                        // ship.spaces.push(originSpace);
                    }
                }
            }
            // console.log(ship.spaces);

        }

        // receiveAttack(){

        // },

        // isGameOver(){

        // }
    }
}