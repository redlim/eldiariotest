var app = new Vue({
    el: '#app',
    data: {
        code: [
            {   name:'Exercise 2',
                data:'function removeProperty(obj,prop){\n' +
                    'return obj[prop] ? delete obj[prop] : false;\n' +
                    '}'
            },
            {
                name: 'Exercise 3',
                data:'const formatDate = (userDate) => {\n' +
                    '    const validDate = userDate.match(/^(1[0-2]|[1-9])\\/(3[01]|[12][0-9]|[1-9])\\/(\\d{4})$/);\n' +
                    '    return validDate ? \n' +
                    '    validDate[3] + beautifyNumberDate(validDate[1]) + beautifyNumberDate(validDate[2])\n ' +
                    '    : \'Input date format not valid\'\n' +
                    '}\n' +
                    '\n' +
                    'const beautifyNumberDate = str => {\n' +
                    '    return str.length > 1 ? str : `0${str}`;\n' +
                    '}\n'
            },
            {
                name: 'Exercise 5',
                data:'const reverseOrder = (source) =>{\n' +
                    '    if (typeof source === \'number\'){\n' +
                    '        return  parseInt((source + \'\').split(\'\').sort().reverse().join(\'\'))\n' +
                    '    }\n' +
                    '    return null;\n' +
                    '}'
            },
            {
                name: 'Exercise 6',
                data: 'const getValue = (obj, props) => {\n' +
                    '    if(props.split(\'.\').length === 1 ) return obj[props];\n' +
                    '    const result = obj[props.split(\'.\')[0]];\n' +
                    '    if (!result) return null;\n' +
                    '    return getValue(result,props.substring(props.indexOf(\'.\')+1,props.length))\n' +
                    '}\n' +
                    'const accessor = (obj,defaultValue,props)  => {\n' +
                    '    if (props === undefined) return function(props){\n' +
                    '        return accessor(obj,defaultValue,props)\n' +
                    '    };\n' +
                    '    return getValue(obj,props) ? getValue(obj,props) : defaultValue\n' +
                    '};\n'
            }
        ]
    }
})