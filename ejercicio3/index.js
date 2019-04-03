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

module.exports = formatDate;