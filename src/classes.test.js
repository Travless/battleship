const Ship = require('./classes')

describe('Ship', () => {
    const ship = new Ship();

    test('create object with the blueprint of a Ship class', () => {
        expect(typeof ship.isSunk()).toBe('function');
    })
})