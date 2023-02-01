import _ from 'lodash';
import './style.css';

const content = document.getElementById('content');

class Ship {
    constructor(length, hits, sunk){
        this.length = length,
        this.hits = hits,
        this.sunk = sunk
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

