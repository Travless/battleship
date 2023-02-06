import { throttle } from "lodash";

// Ship class that is used to generate ship objects
export class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
    }
}