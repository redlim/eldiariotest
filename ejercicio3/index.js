//Ejercicio 3
// Implementa la función formatDate que convierta la fecha introducida por el usuario formateada como M/D/AAAA a un formato requerido por una API (AAAAMMDD).
// El parámetro 'userDate' y el valor de retorno son strings.
//
// Por ejemplo, debería convertir la fecha "11/26/2014" introducida por el usuario en "20141126" adecuada para la API.

const formatDate = (userDate) => {
    const validDate = userDate.match(/^(1[0-2]|[1-9])\/(3[01]|[12][0-9]|[1-9])\/(\d{4})$/);
    return validDate ? validDate[3] + beautifyNumberDate(validDate[1]) + beautifyNumberDate(validDate[2]) : 'Input date format not valid'
}

const beautifyNumberDate = str => {
    return str.length > 1 ? str : `0${str}`;
}

assert.equal(formatDate('11/26/2014'), '20141126');
assert.notEqual(formatDate('11/26/2014'), '201402611');
assert.equal(formatDate('2/21/2016'), '20160221');
assert.equal(formatDate('9/2/2001'), '20010902');
assert.notEqual(formatDate('9/2/2001'), '200192');
assert.equal(formatDate('13/26/2014'),'Input date format not valid'); // No existe el mes 13
assert.equal(formatDate('9/33/2014'),'Input date format not valid'); // No existe el día 33