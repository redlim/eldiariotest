//Ejercicio 6
// Implementar un método que permita acceder de forma segura a propiedades de un objeto, incluso cuando dichas propiedades no existen.
//
// La función debe admitir tres parámetros:
// el objeto al que se va a acceder
// el valor por defecto que va a devolver la función en caso de que la propiedad no exista dentro del objeto
// y por último, un string indicando el path de la propiedad a consultar.
//
// El path delimitará el camino en el cual se encuentra la propiedad a consultar. Los distintos niveles de profundidad se delimitaran con puntos.
// Además este último parámetro es opcional. En caso de no proveerse, la función devolverá otra función que esperará ser invocada con el path de la propiedad como argumento.

const getValue = (obj, props) => {
    if(props.split('.').length === 1 ) return obj[props];
    const prop = props.split('.')[0];
    if (!obj.hasOwnProperty(prop)) return null;
    return getValue(obj[prop],props.substring(props.indexOf('.')+1,props.length));
};

const accessor = (obj,defaultValue,props)  => {
    if (props === undefined) return function(props){
        return accessor(obj,defaultValue,props);
    };
    return getValue(obj,props) ? getValue(obj,props) : defaultValue;
};

module.exports = accessor;