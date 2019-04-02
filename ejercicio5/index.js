//Ejercicio 5
// Implementar una función que dado un número entero, devuelva otro número formado por sus mismos dígitos ordenados descendentemente
const reverseOrder = (source) =>{
    if (typeof source === 'number'){
        return  parseInt((source + '').split('').sort().reverse().join(''))
    }
    return null;
}

assert.equal(reverseOrder(7573), 7753);
assert.equal(reverseOrder(2756938), 9876532);
assert.equal(reverseOrder(3040), 4300);
assert.equal(reverseOrder(9876), 9876);
assert.notEqual(reverseOrder(9821),1289);
assert.equal(reverseOrder('patata'), null);
assert.equal(reverseOrder(121.21), 22111); // caso especial que no he
// querido controlar por limpieza de código pero con un redondeo o contemplando que no sea float bastaría