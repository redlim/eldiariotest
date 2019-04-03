//Ejercicio 5
// Implementar una función que dado un número entero, devuelva otro número formado por sus mismos dígitos ordenados descendentemente
const reverseOrder = (source) =>{
    if (typeof source === 'number'){
        return  parseInt((source + '').split('').sort().reverse().join(''))
    }
    return null;
}

module.exports = reverseOrder