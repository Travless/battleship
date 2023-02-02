// const { ModuleFilenameHelpers } = require("webpack");

export function createShip (length){
    return{
        length: length,
        hits: 0,
        sunk: false,
        spaces: [],

        hit(){
            this.hits += 1;
        },

        isSunk(){
            if(hits >= length){
                this.sunk = true;
            } else {
                this.sunk = false;
            }
        }
    }
}

export function createGameboard (){
    return {
        playerShips: [[[0,2], [0,3], [0,4]]],
        direction: true,

        placeShip(size, coord){
            const ship = createShip(size);
            for (let i = 0; i < this.playerShips.length; i++){
                for( let j = 0; j < this.playerShips[i].length; j++){
                    if(this.playerShips[j][0] === coord[0] && this.playerShips[j][1] === coord[1]){
                        return true;
                    }
                }
            }
            return false;
        }
    }
}


// class Ship {
//     constructor(length){
//         this.length = length;
//         this.hits = 0;
//         this.sunk = false;
//         this.spaces = [];
//     }

//     hit(){
//         this.hits = this.hits + 1;
//     }

//     isSunk(){
//         if(this.hits >= this.length){
//             this.sunk = true;
//         } else {
//             this.sunk = false;
//         }
//     }
// };

// class Space {
//     constructor(row, col){
//         this.row = row;
//         this.col = col;
//     };
// };

// Direction represents the direction the ship will be facing when placed. true === width, false === height
// export class Gameboard {
//     constructor(){
//         this.playerShips = [[{row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}]];
//         this.direction = true;
//     }

    // placeShip(size, coord){
    //     const ship = new Ship(size);
    //     let availability = [];
    //     let location = []

    //     if(this.playerTurn === true){
    //         if(this.direction === true){
    //             for(let i = 0; i < size; i++){
    //                 let combine = parseFloat(coord[0].col) + parseFloat(1);
    //                 let colText = combine.toString();
    //                 coord[0].col = colText
    //                 console.log(coord[0].col);


    //                 let available = this.spaceCheckWidth(this.playerShips, coord, i);
    //                 availability.push(available);
    //                 if (available === false){
    //                     location.push(coord)
    //                 }
    //             }
    //             // if (availability.includes(true)){
    //             //     console.log("can't place here");
    //             // } else {
    //             //     this.playerShips.push([row, col]);
    //             // }
    //         }
    //     }
    //     // console.log(location);
    // }

//     spaceCheckWidth(array, coord, add){
//         const spaceAvailable = array.includes(coord);
//         return spaceAvailable;
//     }
// }

// module.exports = Ship