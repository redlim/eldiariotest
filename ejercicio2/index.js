//Ejercicio 2
// Implementa la función removeProperty la cual recibe un objeto (obj) y una propiedad (prop) y hace lo siguiente:
// Si el objeto obj tiene la propiedad prop, la función borra la propiedad del object y devuelve true, en los demás casos devuelve false.
const assert = require('assert')
function removeProperty(obj,prop){
    return obj[prop] ? delete obj[prop] : false;
}

module.exports = removeProperty